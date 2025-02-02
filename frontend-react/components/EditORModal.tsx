import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { OR, ORCategory, ORFloor } from "@/contexts/ORContext"

interface EditORModalProps {
  or: OR | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedOR: Omit<OR, "id" | "date">) => void
}

const categories: ORCategory[] = ["Cardio", "Thoracic", "GenSurg", "Ortho", "Neuro", "Other"]
const floors: ORFloor[] = ["Second", "Third"]

export function EditORModal({ or, isOpen, onClose, onSave }: EditORModalProps) {
  const [number, setNumber] = useState(or?.number || "")
  const [floor, setFloor] = useState<ORFloor>(or?.floor || "Third")
  const [category, setCategory] = useState<ORCategory>(or?.category || "GenSurg")
  const [pcuBay, setPcuBay] = useState(or?.pcuBay || "")
  const [service, setService] = useState(or?.service || "")

  useEffect(() => {
    if (or) {
      setNumber(or.number)
      setFloor(or.floor)
      setCategory(or.category)
      setPcuBay(or.pcuBay)
      setService(or.service || "")
    }
  }, [or])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ number, floor, category, isActive: or?.isActive || true, pcuBay, service })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit OR</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                OR Number
              </Label>
              <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Floor
              </Label>
              <Select value={floor} onValueChange={(value: ORFloor) => setFloor(value)}>
                <SelectTrigger id="floor" className="col-span-3">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f} Floor
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={category} onValueChange={(value: ORCategory) => setCategory(value)}>
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pcuBay" className="text-right">
                PCU Bay
              </Label>
              <Input id="pcuBay" value={pcuBay} onChange={(e) => setPcuBay(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Input id="service" value={service} onChange={(e) => setService(e.target.value)} className="col-span-3" />
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

