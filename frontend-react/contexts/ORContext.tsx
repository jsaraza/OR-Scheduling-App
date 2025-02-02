"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

export type ORCategory = "Cardio" | "Thoracic" | "GenSurg" | "Ortho" | "Neuro" | "Other"
export type ORFloor = "Second" | "Third"

export interface OR {
  id: string
  number: string
  floor: ORFloor
  category: ORCategory
  isActive: boolean
  date: string
  pcuBay: string
  service?: string
}

interface ORContextType {
  ors: OR[]
  addOR: (or: Omit<OR, "id">) => void
  updateOR: (id: string, or: Partial<OR>) => void
  deleteOR: (id: string) => void
  getORsByDate: (date: string) => OR[]
}

const ORContext = createContext<ORContextType | undefined>(undefined)

export const useORs = () => {
  const context = useContext(ORContext)
  if (!context) {
    throw new Error("useORs must be used within an ORProvider")
  }
  return context
}

export const ORProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ors, setORs] = useState<OR[]>([])

  const addOR = (or: Omit<OR, "id">) => {
    setORs((prev) => [...prev, { ...or, id: Date.now().toString() }])
  }

  const updateOR = (id: string, updates: Partial<OR>) => {
    setORs((prev) => prev.map((or) => (or.id === id ? { ...or, ...updates } : or)))
  }

  const deleteOR = (id: string) => {
    setORs((prev) => prev.filter((or) => or.id !== id))
  }

  const getORsByDate = (date: string) => {
    return ors.filter((or) => or.date === date && or.isActive)
  }

  return <ORContext.Provider value={{ ors, addOR, updateOR, deleteOR, getORsByDate }}>{children}</ORContext.Provider>
}

