# solver_service.py
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ortools.sat.python import cp_model

app = FastAPI(title="OR Nurse Assignment Solver")

# ---------------------------
# Input Models
# ---------------------------
class Nurse(BaseModel):
    id: int
    name: str
    role: str           # "RN" or "LPN"
    shift: str          # "early" or "late"
    # Additional fields (shift start/end, previous assignments, etc.) can be added as needed.

class BayPosition(BaseModel):
    bay_id: int
    duration_type: int  # 0 for short (30 min), 1 for long (45-60 min)
    surgeries: int      # Number of surgeries in this OR (expected 1-6)
    or_name: Optional[str] = None      # OR name/number (optional)
    specialty: Optional[str] = None    # OR specialty/service (optional)

class BayBlock(BaseModel):
    block_id: int
    # For each nurse position in the group, we have two bay positions.
    # According to the PRD, the mapping is:
    #   pos0 (Nurse 1): bays[0] and bays[1]  → (Bays 1 and 2)
    #   pos1 (Nurse 2): bays[3] and bays[4]  → (Bays 4 and 5)
    #   pos2 (Late Nurse): bays[2] and bays[5] → (Bays 3 and 6)
    bays: List[BayPosition]  # Must contain exactly 6 BayPosition items.

class SolverInput(BaseModel):
    nurses: List[Nurse]
    bay_blocks: List[BayBlock]  # One bay block per group (e.g., 10 blocks for 60 PCC bays)
    # (Additional fields such as previous-day assignments for daily variety can be added later.)

# ---------------------------
# Solver Endpoint
# ---------------------------
@app.post("/solve")
def solve_assignment(data: SolverInput):
    nurses = data.nurses
    bay_blocks = data.bay_blocks

    # --- Enforce Unique OR Assignments in Each Bay Block ---
    for bay_block in bay_blocks:
        # Collect all OR names (assume they are provided and non-None)
        or_names = [bay.or_name for bay in bay_block.bays]
        if len(or_names) != len(set(or_names)):
            raise HTTPException(
                status_code=400,
                detail=f"Bay block {bay_block.block_id} has duplicate OR assignments. All ORs must be unique."
            )

    model = cp_model.CpModel()
    num_groups = len(bay_blocks)
    num_nurses = len(nurses)

    # Create decision variables:
    # For each group (bay block) and each position (0, 1, 2),
    # assign a nurse (by index in the nurses list)
    group_vars = {}
    for g in range(num_groups):
        for pos in range(3):
            group_vars[(g, pos)] = model.NewIntVar(0, num_nurses - 1, f"group_{g}_pos_{pos}")

    # Enforce that each nurse is assigned at most once (across all groups)
    all_vars = [group_vars[(g, pos)] for g in range(num_groups) for pos in range(3)]
    model.AddAllDifferent(all_vars)

    # --- Constraint: Shift Requirements ---
    # Positions 0 and 1 (early positions) must be filled by nurses with an "early" shift.
    # Position 2 must be filled by a nurse with a "late" shift.
    for g in range(num_groups):
        for pos in [0, 1]:
            for idx, nurse in enumerate(nurses):
                if nurse.shift != "early":
                    model.Add(group_vars[(g, pos)] != idx)
        for idx, nurse in enumerate(nurses):
            if nurse.shift != "late":
                model.Add(group_vars[(g, 2)] != idx)

    # --- Constraint: Early Nurse Pairing Rule ---
    # In each group, the two early nurse positions (pos0 and pos1) cannot both be LPN.
    for g in range(num_groups):
        for i in range(num_nurses):
            if nurses[i].shift == "early" and nurses[i].role == "LPN":
                for j in range(num_nurses):
                    if nurses[j].shift == "early" and nurses[j].role == "LPN" and i != j:
                        # Prevent the assignment where pos0 is nurse i and pos1 is nurse j.
                        model.AddBoolOr([group_vars[(g, 0)] != i, group_vars[(g, 1)] != j])

    # Define the bay pair mapping according to the PRD:
    # pos0 (Nurse 1): indices (0,1)
    # pos1 (Nurse 2): indices (3,4)
    # pos2 (Late Nurse): indices (2,5)
    bay_pairs = [(0, 1), (3, 4), (2, 5)]

    # --- Constraint: Procedure Duration Check ---
    # For each group and nurse position, verify that the corresponding bay pair
    # yields one short and one long procedure.
    for g in range(num_groups):
        bay_block = bay_blocks[g]
        if len(bay_block.bays) != 6:
            raise HTTPException(
                status_code=400,
                detail=f"Bay block {bay_block.block_id} must have exactly 6 bay positions."
            )
        for pos, pair in enumerate(bay_pairs):
            d1 = bay_block.bays[pair[0]].duration_type
            d2 = bay_block.bays[pair[1]].duration_type
            if (d1, d2) not in [(0, 1), (1, 0)]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Bay block {bay_block.block_id} for group {g} has an invalid duration pairing for position {pos}."
                )

    # --- (Optional) Constraint: Workload Balancing ---
    # For each nurse, compute the total surgery count from their assigned bays.
    nurse_load_vars = [model.NewIntVar(0, 1000, f"load_nurse_{i}") for i in range(num_nurses)]
    nurse_load_contrib = {i: [] for i in range(num_nurses)}
    for g in range(num_groups):
        bay_block = bay_blocks[g]
        for pos, pair in enumerate(bay_pairs):
            surgeries = bay_block.bays[pair[0]].surgeries + bay_block.bays[pair[1]].surgeries
            for i in range(num_nurses):
                bvar = model.NewBoolVar(f"nurse_{i}_in_group_{g}_pos_{pos}")
                model.Add(group_vars[(g, pos)] == i).OnlyEnforceIf(bvar)
                model.Add(group_vars[(g, pos)] != i).OnlyEnforceIf(bvar.Not())
                load_contrib = model.NewIntVar(0, surgeries, f"load_g{g}_pos{pos}_nurse_{i}")
                model.Add(load_contrib == surgeries * bvar)
                nurse_load_contrib[i].append(load_contrib)
    for i in range(num_nurses):
        model.Add(nurse_load_vars[i] == sum(nurse_load_contrib[i]))

    # (Optional) Objective: Minimize the difference between maximum and minimum nurse load.
    max_load = model.NewIntVar(0, 1000, "max_load")
    min_load = model.NewIntVar(0, 1000, "min_load")
    model.AddMaxEquality(max_load, nurse_load_vars)
    model.AddMinEquality(min_load, nurse_load_vars)
    diff = model.NewIntVar(0, 1000, "load_diff")
    model.Add(diff == max_load - min_load)
    model.Minimize(diff)

    # --- Solve the Model with Randomization ---
    solver = cp_model.CpSolver()
    # Set a random seed so that the solution can vary between runs
    solver.parameters.random_seed = random.randint(0, 1000000)
    status = solver.Solve(model)
    if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        raise HTTPException(status_code=400, detail="No feasible assignment found.")

    # --- Construct the Response ---
    result = {"groups": []}
    for g in range(num_groups):
        group_assignment = {}
        group_assignment["group_label"] = chr(65 + g) if g < 26 else f"Group_{g}"
        for pos in range(3):
            nurse_idx = solver.Value(group_vars[(g, pos)])
            nurse = nurses[nurse_idx]
            group_assignment[f"pos_{pos}"] = {
                "nurse_id": nurse.id,
                "name": nurse.name,
                "role": nurse.role,
                "shift": nurse.shift
            }
        bay_block = bay_blocks[g]
        # Use model_dump() if using Pydantic v2 (or use dict() for Pydantic v1)
        group_assignment["bay_block"] = bay_block.model_dump()
        result["groups"].append(group_assignment)

    return result
