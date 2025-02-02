"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSurgeries, type Assignment } from "@/contexts/SurgeriesContext"
import { SurgeryDetailsModal } from "@/components/SurgeryDetailsModal"
import { useORs } from "@/contexts/ORContext"
import { useNurses } from "@/contexts/NurseContext"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

const hours = Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

interface Surgery {
  id: string;
  orNumber: string;
  startTime: string;
  description: string;
  date: string;
  protocolLength: "short" | "long";
}

export default function Assignments() {
  const { surgeries, selectedDate, setAssignments } = useSurgeries()
  const { getORsByDate } = useORs()
  const { nurses } = useNurses()
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState("Third Floor (1-9)")
  const [viewMode, setViewMode] = useState<"group" | "all">("group")
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get ORs for the selected date
  const dateORs = getORsByDate(selectedDate)

  // Create dynamic OR groups based on the active ORs
  const orGroups = useMemo(() => {
    const thirdFloorORs = dateORs.filter((or) => or.floor === "Third").map((or) => or)
    const secondFloorORs = dateORs.filter((or) => or.floor === "Second").map((or) => or)

    return {
      "Third Floor (1-9)": thirdFloorORs.slice(0, 9),
      "Third Floor (10-15)": thirdFloorORs.slice(9, 15),
      "Second Floor (1-9)": secondFloorORs.slice(0, 9),
      "Second Floor (10-12)": secondFloorORs.slice(9, 12),
    }
  }, [dateORs])

  const generateSchedule = async () => {
    try {
      // This is where you would call your backend API to generate the schedule
      // For now, we'll just simulate a delay and create a mock schedule
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockAssignments: Assignment[] = surgeries.map((surgery) => ({
        nurseId: nurses[Math.floor(Math.random() * nurses.length)].id,
        surgeryId: surgery.id,
        orNumber: surgery.orNumber,
        startTime: surgery.startTime,
        endTime: addHoursToTime(surgery.startTime, 2), // Assume 2-hour surgeries for simplicity
      }))

      setLocalAssignments(mockAssignments)
      setAssignments(mockAssignments) // Save to context
      toast({
        title: "Schedule generated",
        description: "The schedule has been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const finalizeAssignments = async () => {
    // Here you would typically send the assignments to a backend API
    console.log("Finalizing assignments:", localAssignments)
    toast({
      title: "Assignments Finalized",
      description: "The assignments have been saved and finalized.",
    })
  }

  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes
    const hourHeight = 120 // Height of one hour block in pixels
    return (totalMinutes / 60) * hourHeight
  }

  const getAssignment = (orNumber: string, hour: string) => {
    return surgeries.filter((s) => {
      const surgeryHour = s.startTime.split(":")[0].padStart(2, "0")
      const compareHour = hour.split(":")[0]
      return s.orNumber === orNumber && surgeryHour === compareHour && s.date === selectedDate
    })
  }

  const handleAssignmentChange = (orNumber: string, time: string, nurseId: string) => {
    const updatedAssignments = localAssignments.map((assignment) => {
      if (assignment.orNumber === orNumber && assignment.startTime === time) {
        return { ...assignment, nurseId }
      }
      return assignment
    })
    setLocalAssignments(updatedAssignments)
  }

  const handleSurgeryClick = (surgery: Surgery) => {
    setSelectedSurgery({
      ...surgery
    })
    setIsModalOpen(true)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Cardio: "bg-red-100 text-red-800",
      Thoracic: "bg-blue-100 text-blue-800",
      GenSurg: "bg-green-100 text-green-800",
      Ortho: "bg-yellow-100 text-yellow-800",
      Neuro: "bg-purple-100 text-purple-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.Other
  }

  const renderORGrid = (ors: typeof dateORs) => (
    <div className="flex-1 overflow-auto">
      <div className={`grid grid-cols-[auto,repeat(${ors.length},1fr)] gap-2 min-w-[800px]`}>
        {/* Header row */}
        <div className="sticky top-0 bg-background z-20 border-b">
          <div className="h-20 flex items-center font-semibold">Time</div>
        </div>
        {ors.map((or) => (
          <div key={or.id} className="sticky top-0 bg-background z-20 border-b">
            <div className="h-20 flex flex-col items-center justify-center font-semibold border-l">
              <div>{or.number}</div>
              <Badge variant="secondary" className={`mt-1 ${getCategoryColor(or.category)}`}>
                {or.category}
              </Badge>
            </div>
          </div>
        ))}

        {/* Time slots and assignments */}
        {hours.map((hour, index) => (
          <>
            <div key={`time-${hour}`} className="h-[120px] flex items-start pt-2 font-medium border-t">
              {hour}
            </div>
            {ors.map((or) => {
              const hourAssignments = getAssignment(or.number, hour)
              return (
                <div key={`${or.number}-${hour}`} className="h-[120px] border-l border-t relative">
                  {hourAssignments.map((assignment) => (
                    <div
                      key={`${assignment.orNumber}-${assignment.startTime}`}
                      className="absolute left-0 right-0 px-1"
                      style={{
                        top: `${calculatePosition(assignment.startTime) % 120}px`,
                      }}
                    >
                      <Card
                        className="h-14 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleSurgeryClick(assignment)}
                      >
                        <CardContent className="p-2 space-y-1">
                          <div className="font-medium text-sm truncate" title={assignment.description}>
                            {assignment.description} ({assignment.startTime})
                          </div>
                          <Select
                            value={
                              localAssignments.find(
                                (a) => a.orNumber === assignment.orNumber && a.startTime === assignment.startTime,
                              )?.nurseId
                            }
                            onValueChange={(value) =>
                              handleAssignmentChange(assignment.orNumber, assignment.startTime, value)
                            }
                          >
                            <SelectTrigger className="h-6 text-xs">
                              <SelectValue placeholder="Assign nurse" />
                            </SelectTrigger>
                            <SelectContent>
                              {nurses.map((nurse) => (
                                <SelectItem key={nurse.id} value={nurse.id}>
                                  {nurse.name} ({nurse.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">OR Assignments</h1>
        <p className="text-lg">Selected Date: {selectedDate}</p>
        <div>
          <Button onClick={generateSchedule} className="mr-2">
            Generate Schedule
          </Button>
          <Button onClick={finalizeAssignments}>Finalize Assignments</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={viewMode} onValueChange={(value: "group" | "all") => setViewMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="group">View by Group</SelectItem>
              <SelectItem value="all">View All ORs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "group" ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-4">
            {Object.keys(orGroups).map((group) => (
              <TabsTrigger key={group} value={group} className="text-xs sm:text-sm">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(orGroups).map(([group, ors]) => (
            <TabsContent key={group} value={group} className="flex-1 mt-0">
              {ors.length > 0 ? (
                renderORGrid(ors)
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No ORs configured for this group</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        renderORGrid(Object.values(orGroups).flat())
      )}

      <SurgeryDetailsModal surgery={selectedSurgery} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number)
  const newHours = (h + hours) % 24
  return `${newHours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

