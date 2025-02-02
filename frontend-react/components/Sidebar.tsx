"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/or-management", label: "OR Management" },
  { href: "/dashboard/nurses", label: "Nurse Management" },
  { href: "/dashboard/assignments", label: "Assignments" },
  { href: "/dashboard/grid-assignments", label: "Grid Assignments" },
  { href: "/dashboard/reports", label: "Reports" },
]

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <aside className="h-screen bg-gray-100 w-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-gray-200")}>
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

