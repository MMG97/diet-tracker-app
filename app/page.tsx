"use client"

import { useAuth } from "@/components/auth-provider"
import LoginScreen from "@/components/login-screen"
import Navigation from "@/components/navigation"
import UserHeader from "@/components/user-header"
import MealLoggerForm from "@/components/meal-logger-form"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <UserHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-center text-2xl font-bold">Log Your Meal</h1>
          <MealLoggerForm />
        </div>
      </main>
    </div>
  )
}
