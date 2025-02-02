import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Surgery {
  id: string
  orNumber: string
  protocolLength: "short" | "long"
  startTime: string
  description: string
}

interface SurgeryDetailsModalProps {
  surgery: Surgery | null
  isOpen: boolean
  onClose: () => void
}

export function SurgeryDetailsModal({ surgery, isOpen, onClose }: SurgeryDetailsModalProps) {
  if (!surgery) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Surgery Details</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">OR Number:</span>
            <span className="col-span-3">{surgery.orNumber}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Description:</span>
            <span className="col-span-3">{surgery.description}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Start Time:</span>
            <span className="col-span-3">{surgery.startTime}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Protocol:</span>
            <span className="col-span-3 capitalize">{surgery.protocolLength}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

