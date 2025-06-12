"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, addDays, subDays } from "date-fns"
import { useAuth } from "@/components/auth-provider"

interface Meal {
  date: string
  time: string
  mealType: string
  foodItems: string
  calories: number
  userEmail: string
  userName: string
  timestamp: string
}

export default function DailySummary() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const formattedDate = format(currentDate, "yyyy-MM-dd")

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load user's meals for the selected date
  useEffect(() => {
    if (!isClient || !user) return

    try {
      const userMealsKey = `meals_${user.email}`
      const allUserMeals: Meal[] = JSON.parse(window.localStorage.getItem(userMealsKey) || "[]")

      // Filter meals for the current date
      const mealsForDate = allUserMeals.filter((meal) => meal.date === formattedDate)

      // Sort by time
      mealsForDate.sort((a, b) => a.time.localeCompare(b.time))

      // Calculate total calories
      const total = mealsForDate.reduce((sum, meal) => sum + meal.calories, 0)

      setTodaysMeals(mealsForDate)
      setTotalCalories(total)
    } catch (error) {
      console.error("Error loading meals:", error)
      setTodaysMeals([])
      setTotalCalories(0)
    }
  }, [formattedDate, isClient, user])

  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1))
  }

  const goToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "lunch":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "dinner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "snack":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "drink":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Please log in to view your meal summary.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <Button variant="ghost" onClick={goToToday} className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {format(currentDate, "MMMM d, yyyy")}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-center">Daily Summary</CardTitle>
        <CardDescription className="text-center">
          Total Calories: <span className="font-bold text-green-600">{totalCalories}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isClient && todaysMeals.length > 0 ? (
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge className={getMealTypeColor(meal.mealType)} variant="secondary">
                    {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">{meal.time}</span>
                </div>
                <p className="mb-1 text-sm">{meal.foodItems}</p>
                <p className="text-right text-sm font-medium">{meal.calories} calories</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No meals logged for this day.</p>
            <p className="mt-2 text-sm">Go to the Log Meal page to add a meal.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
