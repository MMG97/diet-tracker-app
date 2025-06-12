"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { format, subDays } from "date-fns"
import { useAuth } from "@/components/auth-provider"

interface Meal {
  date: string
  calories: number
}

interface DayData {
  date: string
  calories: number
}

export default function CalorieTrends() {
  const { user } = useAuth()
  const [chartData, setChartData] = useState<DayData[]>([])
  const [averageCalories, setAverageCalories] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load user's meal data for trends
  useEffect(() => {
    if (!isClient || !user) return

    try {
      const userMealsKey = `meals_${user.email}`
      const allUserMeals = JSON.parse(window.localStorage.getItem(userMealsKey) || "[]")

      // Generate data for the past 7 days
      const data: DayData[] = []
      const today = new Date()

      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i)
        const formattedDate = format(date, "yyyy-MM-dd")
        const displayDate = format(date, "MMM d")

        // Filter meals for this date
        const mealsForDate = allUserMeals.filter((meal: Meal) => meal.date === formattedDate)

        // Calculate total calories for this date
        const totalCalories = mealsForDate.reduce((sum: number, meal: Meal) => sum + meal.calories, 0)

        data.push({
          date: displayDate,
          calories: totalCalories,
        })
      }

      // Calculate average calories (only for days with data)
      const daysWithData = data.filter((day) => day.calories > 0)
      const total = daysWithData.reduce((sum, day) => sum + day.calories, 0)
      const avg = daysWithData.length > 0 ? Math.round(total / daysWithData.length) : 0

      setChartData(data)
      setAverageCalories(avg)
    } catch (error) {
      console.error("Error loading trend data:", error)
      setChartData([])
      setAverageCalories(0)
    }
  }, [isClient, user])

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          <p>Please log in to view your calorie trends.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Calorie Trends</CardTitle>
        <CardDescription>
          Your calorie intake over the past 7 days
          {averageCalories > 0 && (
            <div className="mt-1">
              Average: <span className="font-medium text-green-600">{averageCalories} calories/day</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isClient && (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} calories`, "Calories"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="calories" fill="#22c55e" radius={[4, 4, 0, 0]} name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
