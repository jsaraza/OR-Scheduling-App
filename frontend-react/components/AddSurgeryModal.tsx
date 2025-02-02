"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function AddSurgeryModal({ isOpen, onClose, onAdd }) {
  const [orNumber, setOrNumber] = useState("")
  const [protocolLength, setProtocolLength] = useState("")
  const [startTime, setStartTime] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ orNumber, protocolLength, startTime })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Surgery</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orNumber" className="text-right">
                OR Number
              </Label>
              <Input
                id="orNumber"
                value={orNumber}
                onChange={(e) => setOrNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protocolLength" className="text-right">
                Protocol Length
              </Label>
              <Select onValueChange={setProtocolLength}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Surgery</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

