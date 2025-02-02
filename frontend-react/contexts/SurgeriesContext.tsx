"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

export interface Surgery {
  id: string
  orNumber: string
  protocolLength: "short" | "long"
  startTime: string
  description: string
  date: string
  specialty: string
}

export interface Assignment {
  nurseId: string
  surgeryId: string
  orNumber: string
  startTime: string
  endTime: string
}

interface SurgeriesContextType {
  surgeries: Surgery[]
  assignments: Assignment[]
  addSurgery: (surgery: Omit<Surgery, "id">) => void
  removeSurgery: (id: string) => void
  updateSurgery: (id: string, surgery: Partial<Surgery>) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  setAssignments: (assignments: Assignment[]) => void
}

const SurgeriesContext = createContext<SurgeriesContextType | undefined>(undefined)

export const useSurgeries = () => {
  const context = useContext(SurgeriesContext)
  if (!context) {
    throw new Error("useSurgeries must be used within a SurgeriesProvider")
  }
  return context
}

export const SurgeriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  const addSurgery = (surgery: Omit<Surgery, "id">) => {
    setSurgeries((prev) => [...prev, { ...surgery, id: Date.now().toString() }])
  }

  const removeSurgery = (id: string) => {
    setSurgeries((prev) => prev.filter((surgery) => surgery.id !== id))
  }

  const updateSurgery = (id: string, updatedSurgery: Partial<Surgery>) => {
    setSurgeries((prev) => prev.map((surgery) => (surgery.id === id ? { ...surgery, ...updatedSurgery } : surgery)))
  }

  return (
    <SurgeriesContext.Provider
      value={{
        surgeries,
        assignments,
        addSurgery,
        removeSurgery,
        updateSurgery,
        selectedDate,
        setSelectedDate,
        setAssignments,
      }}
    >
      {children}
    </SurgeriesContext.Provider>
  )
}

