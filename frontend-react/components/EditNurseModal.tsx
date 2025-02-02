"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { NurseRole, ShiftType, Nurse } from "@/contexts/NurseContext"

const roles: NurseRole[] = ["RN", "LPN"]
const shiftTypes: ShiftType[] = ["Early", "Late", "Single"]

interface EditNurseModalProps {
  nurse: Nurse | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedNurse: Omit<Nurse, "id" | "date">) => void
}

export function EditNurseModal({ nurse, isOpen, onClose, onSave }: EditNurseModalProps) {
  const [name, setName] = useState(nurse?.name || "")
  const [role, setRole] = useState<NurseRole>(nurse?.role || "RN")
  const [shiftStart, setShiftStart] = useState(nurse?.shiftStart || "")
  const [shiftEnd, setShiftEnd] = useState(nurse?.shiftEnd || "")
  const [shiftType, setShiftType] = useState<ShiftType>(nurse?.shiftType || "Early")
  const [specialRole, setSpecialRole] = useState(nurse?.specialRole || "")

  useEffect(() => {
    if (nurse) {
      setName(nurse.name)
      setRole(nurse.role)
      setShiftStart(nurse.shiftStart)
      setShiftEnd(nurse.shiftEnd)
      setShiftType(nurse.shiftType)
      setSpecialRole(nurse.specialRole || "")
    }
  }, [nurse])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      role,
      shiftStart,
      shiftEnd,
      shiftType,
      specialRole: specialRole || undefined,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Nurse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(value: NurseRole) => setRole(value)}>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftStart" className="text-right">
                Shift Start
              </Label>
              <Input
                id="shiftStart"
                type="time"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftEnd" className="text-right">
                Shift End
              </Label>
              <Input
                id="shiftEnd"
                type="time"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftType" className="text-right">
                Shift Type
              </Label>
              <Select value={shiftType} onValueChange={(value: ShiftType) => setShiftType(value)}>
                <SelectTrigger id="shiftType" className="col-span-3">
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialRole" className="text-right">
                Special Role
              </Label>
              <Input
                id="specialRole"
                value={specialRole}
                onChange={(e) => setSpecialRole(e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

