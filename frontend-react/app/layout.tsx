import "./globals.css"
import { Inter } from "next/font/google"
import { SurgeriesProvider } from "@/contexts/SurgeriesContext"
import { ORProvider } from "@/contexts/ORContext"
import { NurseProvider } from "@/contexts/NurseContext"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "OR Nurse Assignment",
  description: "Manage surgical schedules and nurse assignments",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NurseProvider>
          <ORProvider>
            <SurgeriesProvider>{children}</SurgeriesProvider>
          </ORProvider>
        </NurseProvider>
      </body>
    </html>
  )
}

