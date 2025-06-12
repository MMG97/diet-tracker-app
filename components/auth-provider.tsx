"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  name: string
  email: string
  phone: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (userData: Omit<User, "createdAt">) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    try {
      const savedUser = window.localStorage.getItem("currentUser")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: Omit<User, "createdAt">) => {
    const newUser: User = {
      ...userData,
      createdAt: new Date().toISOString(),
    }

    // Save user to localStorage
    window.localStorage.setItem("currentUser", JSON.stringify(newUser))

    // Also save to users list for future reference
    try {
      const existingUsers = JSON.parse(window.localStorage.getItem("allUsers") || "[]")
      const userExists = existingUsers.find((u: User) => u.email === newUser.email)

      if (!userExists) {
        existingUsers.push(newUser)
        window.localStorage.setItem("allUsers", JSON.stringify(existingUsers))
      }
    } catch (error) {
      console.error("Error saving user to users list:", error)
    }

    setUser(newUser)
  }

  const logout = () => {
    window.localStorage.removeItem("currentUser")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
