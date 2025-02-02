"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter()

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log("Logging out...")
    router.push("/")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Button onClick={toggleSidebar} variant="ghost" size="icon" className="mr-4">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">OR Scheduler</h1>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </header>
  )
}

