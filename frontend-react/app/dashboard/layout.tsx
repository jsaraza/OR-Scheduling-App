"use client"

import { type ReactNode, useState } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${sidebarOpen ? "w-64" : "w-0"} flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <Sidebar isOpen={sidebarOpen} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

