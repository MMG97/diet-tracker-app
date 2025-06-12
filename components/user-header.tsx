"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function UserHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="border-b bg-white dark:bg-gray-950 px-4 py-2">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">({user.email})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700">
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  )
}
