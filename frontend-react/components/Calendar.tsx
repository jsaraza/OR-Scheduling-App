"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSurgeries } from "@/contexts/SurgeriesContext"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function Calendar() {
  const { selectedDate, setSelectedDate, surgeries } = useSurgeries()
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDayOfMonth }
  }

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth)

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate.toISOString().split("T")[0])
  }

  const renderCalendarDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]
      const isSelected = date === selectedDate
      const hasSurgeries = surgeries.some((surgery) => surgery.date === date)
      days.push(
        <Button
          key={day}
          variant={isSelected ? "default" : "outline"}
          className={`h-12 ${hasSurgeries ? "font-bold" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </Button>,
      )
    }
    return days
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePrevMonth}>
          <ChevronLeft />
        </Button>
        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <Button variant="outline" onClick={handleNextMonth}>
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
    </div>
  )
}

