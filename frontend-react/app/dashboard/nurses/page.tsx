"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNurses, type NurseRole, type ShiftType, type Nurse } from "@/contexts/NurseContext"
import { useSurgeries } from "@/contexts/SurgeriesContext"
import AddNurseModal from "@/components/AddNurseModal"
import { EditNurseModal } from "@/components/EditNurseModal"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const roles: NurseRole[] = ["RN", "LPN"]
const shiftTypes: ShiftType[] = ["Early", "Late", "Single"]

export default function NurseManagement() {
  const { nurses, addNurse, updateNurse, deleteNurse, getNursesByDate } = useNurses()
  const { selectedDate } = useSurgeries()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null)

  const dateNurses = getNursesByDate(selectedDate)

  const groupedNurses = useMemo(() => {
    return dateNurses.reduce(
      (acc, nurse) => {
        if (!acc[nurse.shiftType]) {
          acc[nurse.shiftType] = []
        }
        acc[nurse.shiftType].push(nurse)
        return acc
      },
      {} as Record<ShiftType, Nurse[]>,
    )
  }, [dateNurses])

  const handleAddNurse = (nurse: Omit<Nurse, "id">) => {
    addNurse(nurse)
    setIsAddModalOpen(false)
  }

  const handleEditNurse = (nurse: Nurse) => {
    setEditingNurse(nurse)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedNurse: Omit<Nurse, "id" | "date">) => {
    if (editingNurse) {
      updateNurse(editingNurse.id, { ...updatedNurse, date: selectedDate })
    }
    setIsEditModalOpen(false)
  }

  const renderNurseTable = (nurses: Nurse[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Shift Start</TableHead>
          <TableHead>Shift End</TableHead>
          <TableHead>Special Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nurses.map((nurse) => (
          <TableRow key={nurse.id}>
            <TableCell>{nurse.name}</TableCell>
            <TableCell>{nurse.role}</TableCell>
            <TableCell>{nurse.shiftStart}</TableCell>
            <TableCell>{nurse.shiftEnd}</TableCell>
            <TableCell>{nurse.specialRole || "N/A"}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => handleEditNurse(nurse)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteNurse(nurse.id)} className="ml-2">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nurse Management</h1>
        <p className="text-lg">Selected Date: {selectedDate}</p>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Nurse</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nurse Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{dateNurses.length} Nurses</p>
          <p>Early Shift: {groupedNurses["Early"]?.length || 0} Nurses</p>
          <p>Late Shift: {groupedNurses["Late"]?.length || 0} Nurses</p>
          <p>Single Shift: {groupedNurses["Single"]?.length || 0} Nurses</p>
        </CardContent>
      </Card>

      {shiftTypes.map((shiftType) => (
        <Card key={shiftType}>
          <CardHeader>
            <CardTitle>
              {shiftType} Shift Nurses ({groupedNurses[shiftType]?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedNurses[shiftType] && groupedNurses[shiftType].length > 0 ? (
              renderNurseTable(groupedNurses[shiftType])
            ) : (
              <p>No nurses assigned to this shift type.</p>
            )}
          </CardContent>
        </Card>
      ))}

      <AddNurseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddNurse} />
      <EditNurseModal
        nurse={editingNurse}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

