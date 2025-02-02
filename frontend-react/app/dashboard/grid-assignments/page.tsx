"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSurgeries } from "@/contexts/SurgeriesContext"
import { useNurses } from "@/contexts/NurseContext"
import cn from "classnames"

interface Assignment {
  bay: string
  nurse: string
  break_time?: string
  service: string
  or?: string
  isLift?: boolean
  isGray?: boolean
}

// const jp2Data: Assignment[] = [
//   { bay: "1", nurse: "TBD", service: "Post Op", isGray: false },
//   { bay: "2", nurse: "@ 1st cases Phase II arrival", service: "", isGray: true },
//   { bay: "3", nurse: "", service: "+/- RADs", isGray: false },
//   { bay: "4", nurse: "Vanda @ 1100", service: "", isGray: false },
//   { bay: "14", nurse: "Alison L.", break_time: "A", service: "Gynae", or: "8", isGray: false },
//   { bay: "15", nurse: "Alison M @ 1100", service: "Vascular Urgent", or: "17", isGray: true },
//   { bay: "16", nurse: "MaryAnne S.", break_time: "A", service: "RAD Pre & post x2", or: "RAD1", isGray: false },
//   { bay: "17", nurse: "Alison M @ 1100", service: "Ortho/Emergency", or: "4", isGray: true },
//   { bay: "18", nurse: "Lorelei", break_time: "B", service: "Renal Bx", or: "RBx", isGray: false },
//   { bay: "19", nurse: "Amy @ 1000", service: "Cardiac", isGray: true },
//   { bay: "20", nurse: "Ellen", break_time: "B", service: "Thoracics", or: "3", isGray: false },
// ]

// const jp3Data: Assignment[] = [
//   { bay: "3-41 (L)", nurse: "Jessie w/ Alice", break_time: "A", service: "Spine", or: "39", isGray: false },
//   { bay: "3-42", nurse: "Robyn @ 1100", service: "Urgent", or: "31", isGray: true },
//   { bay: "3-43", nurse: "JB", break_time: "A", service: "Plastics Urgent", or: "36", isGray: false },
//   { bay: "3-44", nurse: "Robyn @ 1100", service: "Gyne", or: "35", isGray: true },
//   { bay: "3-45", nurse: "Ruby", break_time: "B", service: "Neuro", or: "33", isGray: false },
//   { bay: "3-46 (L)", nurse: "Tara @ 1200", service: "Ortho Urgent", or: "35", isGray: true },
//   { bay: "3-47 (L)", nurse: "Yessul", break_time: "B", service: "Gen Surg HPB", or: "27", isGray: false },
// ]

// interface FloatNurse {
//   name: string
//   time?: string
//   break_time?: string
//   assignment?: string
// }

// const jp2FloatNurses: FloatNurse[] = [
//   { name: "1. Tiffany (1215)", break_time: "D" },
//   { name: "2. Nicole", break_time: "D" },
//   { name: "3. Melanie@1000" },
// ]

// const jp3FloatNurses: FloatNurse[] = [
//   { name: "1. Annie (1000)", break_time: "E" },
//   { name: "2. Angel", break_time: "E" },
//   { name: "3. Sun" },
//   { name: "4. JM@1300" },
//   { name: "5. Heather @1500" },
// ]

export default function GridAssignments() {
  const { selectedDate, assignments } = useSurgeries()
  const { nurses } = useNurses()
  const [unit, setUnit] = useState<"JP2" | "JP3">("JP2")

  const groupedAssignments = useMemo(() => {
    const jp2Assignments: Assignment[] = []
    const jp3Assignments: Assignment[] = []
    const jp2FloatNurses: Assignment[] = []
    const jp3FloatNurses: Assignment[] = []

    assignments.forEach((assignment) => {
      const nurse = nurses.find((n) => n.id === assignment.nurseId)
      if (!nurse) return

      const newAssignment: Assignment = {
        bay: assignment.orNumber,
        nurse: nurse.name,
        service: "TBD", // You might want to get this from the surgery details
        or: assignment.orNumber,
        isGray: false, // You might want to determine this based on some criteria
      }

      if (assignment.orNumber.startsWith("3-")) {
        jp3Assignments.push(newAssignment)
      } else {
        jp2Assignments.push(newAssignment)
      }
    })

    // Add float nurses (this is a simplification, you might want to determine float nurses differently)
    nurses.forEach((nurse) => {
      if (!assignments.some((a) => a.nurseId === nurse.id)) {
        const floatNurse: Assignment = {
          bay: "",
          nurse: nurse.name,
          break_time: "TBD",
          service: "",
        }
        if (nurse.shiftType === "Early") {
          jp2FloatNurses.push(floatNurse)
        } else {
          jp3FloatNurses.push(floatNurse)
        }
      }
    })

    return { jp2Assignments, jp3Assignments, jp2FloatNurses, jp3FloatNurses }
  }, [assignments, nurses])

  const currentAssignments = unit === "JP2" ? groupedAssignments.jp2Assignments : groupedAssignments.jp3Assignments
  const currentFloatNurses = unit === "JP2" ? groupedAssignments.jp2FloatNurses : groupedAssignments.jp3FloatNurses

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grid Assignments</h1>
        <div className="flex items-center gap-4">
          <Select value={unit} onValueChange={(value: "JP2" | "JP3") => setUnit(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JP2">JP 2</SelectItem>
              <SelectItem value="JP3">JP 3</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-lg">Date: {selectedDate}</p>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="bg-muted p-4 text-center">
          <h2 className="text-lg font-semibold">PeriOp Care Centre</h2>
          <h3 className="text-md">{unit} Daily Assignment</h3>
          <p className="text-sm text-muted-foreground">{selectedDate}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{unit === "JP2" ? "PCC Bay" : "PCU Bay"}</TableHead>
              <TableHead>Nurse</TableHead>
              <TableHead className="w-[80px]">Break</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="w-[80px]">OR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAssignments.map((assignment, index) => (
              <TableRow key={index} className={cn(assignment.isGray ? "bg-muted" : "bg-background")}>
                <TableCell className="font-medium">
                  {assignment.bay}
                  {assignment.isLift && " (L)"}
                </TableCell>
                <TableCell>{assignment.nurse}</TableCell>
                <TableCell>{assignment.break_time}</TableCell>
                <TableCell>{assignment.service}</TableCell>
                <TableCell>{assignment.or}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t">
          <h3 className="font-semibold mb-2">Float Nurse:</h3>
          <Table>
            <TableBody>
              {currentFloatNurses.map((nurse, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[200px]">{nurse.nurse}</TableCell>
                  <TableCell className="w-[80px]">{nurse.break_time}</TableCell>
                  <TableCell>{nurse.service || "*Staff to do their own NDs*"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t text-sm space-y-1">
          <p>Day Charge RN: {unit === "JP2" ? "Carmen" : "Alyssa"}</p>
          <p>Afternoon Charge RN: {unit === "JP2" ? "JM (1330 - 2100)" : "JM 1330 - 21:00"}</p>
          <p>Point of Contact: Melanie (1330 - TBD)</p>
        </div>
      </div>
    </div>
  )
}

