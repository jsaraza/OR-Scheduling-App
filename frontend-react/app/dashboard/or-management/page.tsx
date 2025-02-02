"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useORs, type ORCategory, type OR, type ORFloor } from "@/contexts/ORContext"
import { useSurgeries } from "@/contexts/SurgeriesContext"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { EditORModal } from "@/components/EditORModal"
import { Pencil } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const categories: ORCategory[] = ["Cardio", "Thoracic", "GenSurg", "Ortho", "Neuro", "Other"]
const floors: ORFloor[] = ["Second", "Third"]

export default function ORManagement() {
  const { ors, addOR, updateOR, deleteOR } = useORs()
  const { selectedDate } = useSurgeries()
  const [number, setNumber] = useState("")
  const [floor, setFloor] = useState<ORFloor>("Third")
  const [category, setCategory] = useState<ORCategory>("GenSurg")
  const [pcuBay, setPcuBay] = useState("")
  const [service, setService] = useState("")
  const [editingOR, setEditingOR] = useState<OR | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOR({
      number,
      floor,
      category,
      isActive: true,
      date: selectedDate,
      pcuBay,
      service,
    })
    setNumber("")
    setPcuBay("")
    setService("")
  }

  const toggleORStatus = (id: string, currentStatus: boolean) => {
    updateOR(id, { isActive: !currentStatus })
  }

  const handleEditOR = (or: OR) => {
    setEditingOR(or)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedOR: Omit<OR, "id" | "date">) => {
    if (editingOR) {
      updateOR(editingOR.id, updatedOR)
    }
  }

  const getCategoryColor = (category: ORCategory) => {
    const colors = {
      Cardio: "text-red-500 bg-red-100",
      Thoracic: "text-blue-500 bg-blue-100",
      GenSurg: "text-green-500 bg-green-100",
      Ortho: "text-yellow-500 bg-yellow-100",
      Neuro: "text-purple-500 bg-purple-100",
      Other: "text-gray-500 bg-gray-100",
    }
    return colors[category]
  }

  const dateORs = ors.filter((or) => or.date === selectedDate)
  const totalORs = dateORs.length
  const secondFloorORs = dateORs.filter((or) => or.floor === "Second")
  const thirdFloorORs = dateORs.filter((or) => or.floor === "Third")

  const itemsPerPage = 10
  const totalPages = Math.ceil(dateORs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentORs = dateORs.slice(startIndex, endIndex)

  const renderORTable = (ors: OR[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>OR Number</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>PCU Bay</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ors.map((or) => (
          <TableRow key={or.id}>
            <TableCell>{or.number}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={getCategoryColor(or.category)}>
                {or.category}
              </Badge>
            </TableCell>
            <TableCell>{or.pcuBay}</TableCell>
            <TableCell>{or.service || "N/A"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch checked={or.isActive} onCheckedChange={() => toggleORStatus(or.id, or.isActive)} />
                <span>{or.isActive ? "Active" : "Inactive"}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditOR(or)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteOR(or.id)}>
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">OR Management</h1>
        <p className="text-lg">Selected Date: {selectedDate}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OR Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalORs} ORs</p>
          <p>Second Floor: {secondFloorORs.length} ORs</p>
          <p>Third Floor: {thirdFloorORs.length} ORs</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">OR Number</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter OR number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Select value={floor} onValueChange={(value: ORFloor) => setFloor(value)}>
              <SelectTrigger id="floor">
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
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: ORCategory) => setCategory(value)}>
              <SelectTrigger id="category">
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
          <div className="space-y-2">
            <Label htmlFor="pcuBay">PCU Bay</Label>
            <Input
              id="pcuBay"
              value={pcuBay}
              onChange={(e) => setPcuBay(e.target.value)}
              placeholder="Enter PCU bay number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Enter service (optional)"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Add OR
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Second Floor ORs</CardTitle>
          </CardHeader>
          <CardContent>{renderORTable(secondFloorORs)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third Floor ORs</CardTitle>
          </CardHeader>
          <CardContent>{renderORTable(thirdFloorORs)}</CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <EditORModal
        or={editingOR}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

