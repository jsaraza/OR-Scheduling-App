# test_solver.py
from fastapi.testclient import TestClient
from solver_service import app
import warnings
import pytest

warnings.filterwarnings("ignore", category=DeprecationWarning, 
                       message=".*PyType_Spec.*metaclass.*tp_new.*")

# Add these specific warning filters
warnings.filterwarnings("ignore", category=DeprecationWarning,
                       message=".*MessageMapContainer.*PyType_Spec.*")
warnings.filterwarnings("ignore", category=DeprecationWarning,
                       message=".*ScalarMapContainer.*PyType_Spec.*")

client = TestClient(app)

def test_solve_endpoint():
    payload = {
  "nurses": [
    { "id": 1, "name": "Early10_1", "role": "RN", "shift": "early" },
    { "id": 2, "name": "Early10_2", "role": "RN", "shift": "early" },
    { "id": 3, "name": "Early10_3", "role": "RN", "shift": "early" },
    { "id": 4, "name": "Early11_1", "role": "RN", "shift": "early" },
    { "id": 5, "name": "Early11_2", "role": "RN", "shift": "early" },
    { "id": 6, "name": "Early11_3", "role": "RN", "shift": "early" },
    { "id": 7, "name": "EarlyExtra_1", "role": "RN", "shift": "early" },
    { "id": 8, "name": "EarlyExtra_2", "role": "RN", "shift": "early" },
    { "id": 9, "name": "EarlyExtra_3", "role": "RN", "shift": "early" },
    { "id": 10, "name": "EarlyExtra_4", "role": "RN", "shift": "early" },
    { "id": 11, "name": "EarlyExtra_5", "role": "RN", "shift": "early" },
    { "id": 12, "name": "EarlyExtra_6", "role": "RN", "shift": "early" },
    { "id": 13, "name": "EarlyExtra_7", "role": "RN", "shift": "early" },
    { "id": 14, "name": "EarlyExtra_8", "role": "RN", "shift": "early" },
    { "id": 15, "name": "EarlyExtra_9", "role": "RN", "shift": "early" },
    { "id": 16, "name": "EarlyExtra_10", "role": "RN", "shift": "early" },
    { "id": 17, "name": "EarlyExtra_11", "role": "RN", "shift": "early" },
    { "id": 18, "name": "EarlyExtra_12", "role": "RN", "shift": "early" },
    { "id": 19, "name": "FloatEarly_1", "role": "RN", "shift": "early" },
    { "id": 20, "name": "FloatEarly_2", "role": "RN", "shift": "early" },
    { "id": 21, "name": "FloatEarly_3", "role": "RN", "shift": "early" },
    { "id": 22, "name": "FloatEarly_4", "role": "RN", "shift": "early" },
    { "id": 23, "name": "Late12_1", "role": "RN", "shift": "late" },
    { "id": 24, "name": "Late12_2", "role": "RN", "shift": "late" },
    { "id": 25, "name": "Charge_1pm", "role": "RN", "shift": "late" },
    { "id": 26, "name": "LPN_3pm", "role": "LPN", "shift": "late" },
    { "id": 27, "name": "FloatLate_1", "role": "RN", "shift": "late" },
    { "id": 28, "name": "FloatLate_2", "role": "RN", "shift": "late" },
    { "id": 29, "name": "FloatLate_3", "role": "RN", "shift": "late" },
    { "id": 30, "name": "FloatLate_4", "role": "RN", "shift": "late" }
  ],
  "bay_blocks": [
    {
      "block_id": 1,
      "bays": [
        {
          "bay_id": 1,
          "duration_type": 0,
          "surgeries": 3,
          "or_name": "RAD1",
          "specialty": "Cardiology"
        },
        {
          "bay_id": 2,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "RAD2",
          "specialty": "General"
        },
        {
          "bay_id": 3,
          "duration_type": 0,
          "surgeries": 4,
          "or_name": "RAD3",
          "specialty": "Orthopedics"
        },
        {
          "bay_id": 4,
          "duration_type": 1,
          "surgeries": 3,
          "or_name": "OR-4",
          "specialty": "Neurosurgery"
        },
        {
          "bay_id": 5,
          "duration_type": 0,
          "surgeries": 5,
          "or_name": "OR-5",
          "specialty": "General"
        },
        {
          "bay_id": 6,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-6",
          "specialty": "Cardiology"
        }
      ]
    },
    {
      "block_id": 2,
      "bays": [
        {
          "bay_id": 7,
          "duration_type": 0,
          "surgeries": 3,
          "or_name": "OR-7",
          "specialty": "General"
        },
        {
          "bay_id": 8,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-8",
          "specialty": "Orthopedics"
        },
        {
          "bay_id": 9,
          "duration_type": 0,
          "surgeries": 4,
          "or_name": "OR-9",
          "specialty": "General"
        },
        {
          "bay_id": 10,
          "duration_type": 1,
          "surgeries": 3,
          "or_name": "OR-10",
          "specialty": "Neurosurgery"
        },
        {
          "bay_id": 11,
          "duration_type": 0,
          "surgeries": 5,
          "or_name": "OR-11",
          "specialty": "General"
        },
        {
          "bay_id": 12,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-12",
          "specialty": "Cardiology"
        }
      ]
    },
    {
      "block_id": 3,
      "bays": [
        {
          "bay_id": 13,
          "duration_type": 0,
          "surgeries": 3,
          "or_name": "OR-13",
          "specialty": "General"
        },
        {
          "bay_id": 14,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-14",
          "specialty": "Orthopedics"
        },
        {
          "bay_id": 15,
          "duration_type": 0,
          "surgeries": 4,
          "or_name": "OR-15",
          "specialty": "General"
        },
        {
          "bay_id": 16,
          "duration_type": 1,
          "surgeries": 3,
          "or_name": "OR-16",
          "specialty": "Neurosurgery"
        },
        {
          "bay_id": 17,
          "duration_type": 0,
          "surgeries": 5,
          "or_name": "OR-17",
          "specialty": "General"
        },
        {
          "bay_id": 18,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-18",
          "specialty": "Cardiology"
        }
      ]
    },
    {
      "block_id": 4,
      "bays": [
        {
          "bay_id": 19,
          "duration_type": 0,
          "surgeries": 3,
          "or_name": "OR-19",
          "specialty": "General"
        },
        {
          "bay_id": 20,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-20",
          "specialty": "Orthopedics"
        },
        {
          "bay_id": 21,
          "duration_type": 0,
          "surgeries": 4,
          "or_name": "OR-21",
          "specialty": "General"
        },
        {
          "bay_id": 22,
          "duration_type": 1,
          "surgeries": 3,
          "or_name": "OR-22",
          "specialty": "Neurosurgery"
        },
        {
          "bay_id": 23,
          "duration_type": 0,
          "surgeries": 5,
          "or_name": "OR-23",
          "specialty": "General"
        },
        {
          "bay_id": 24,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-24",
          "specialty": "Cardiology"
        }
      ]
    },
    {
      "block_id": 5,
      "bays": [
        {
          "bay_id": 25,
          "duration_type": 0,
          "surgeries": 3,
          "or_name": "OR-25",
          "specialty": "General"
        },
        {
          "bay_id": 26,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-26",
          "specialty": "Orthopedics"
        },
        {
          "bay_id": 27,
          "duration_type": 0,
          "surgeries": 4,
          "or_name": "OR-27",
          "specialty": "General"
        },
        {
          "bay_id": 28,
          "duration_type": 1,
          "surgeries": 3,
          "or_name": "OR-28",
          "specialty": "Neurosurgery"
        },
        {
          "bay_id": 29,
          "duration_type": 0,
          "surgeries": 5,
          "or_name": "OR-29",
          "specialty": "General"
        },
        {
          "bay_id": 30,
          "duration_type": 1,
          "surgeries": 2,
          "or_name": "OR-30",
          "specialty": "Cardiology"
        }
      ]
    }
  ]
}



    response = client.post("/solve", json=payload)
    print("Response JSON:", response.json())  # This will print the output
    assert response.status_code == 200
    data = response.json()
    assert "groups" in data
    assert data["groups"][0]["group_label"] == "A"
