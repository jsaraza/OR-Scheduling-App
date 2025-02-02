"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

export type NurseRole = "RN" | "LPN"
export type ShiftType = "Early" | "Late" | "Single"

export interface Nurse {
  id: string
  name: string
  role: NurseRole
  shiftStart: string
  shiftEnd: string
  shiftType: ShiftType
  specialRole?: string
  date: string
}

interface NurseContextType {
  nurses: Nurse[]
  addNurse: (nurse: Omit<Nurse, "id">) => void
  updateNurse: (id: string, nurse: Partial<Nurse>) => void
  deleteNurse: (id: string) => void
  getNursesByDate: (date: string) => Nurse[]
}

const NurseContext = createContext<NurseContextType | undefined>(undefined)

export const useNurses = () => {
  const context = useContext(NurseContext)
  if (!context) {
    throw new Error("useNurses must be used within a NurseProvider")
  }
  return context
}

export const NurseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nurses, setNurses] = useState<Nurse[]>([])

  const addNurse = (nurse: Omit<Nurse, "id">) => {
    setNurses((prev) => [...prev, { ...nurse, id: Date.now().toString() }])
  }

  const updateNurse = (id: string, updates: Partial<Nurse>) => {
    setNurses((prev) => prev.map((nurse) => (nurse.id === id ? { ...nurse, ...updates } : nurse)))
  }

  const deleteNurse = (id: string) => {
    setNurses((prev) => prev.filter((nurse) => nurse.id !== id))
  }

  const getNursesByDate = (date: string) => {
    return nurses.filter((nurse) => nurse.date === date)
  }

  return (
    <NurseContext.Provider value={{ nurses, addNurse, updateNurse, deleteNurse, getNursesByDate }}>
      {children}
    </NurseContext.Provider>
  )
}

