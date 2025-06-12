"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, Utensils } from "lucide-react"

export default function Component() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const mealData = {
      date: formData.get("date"),
      time: formData.get("time"),
      mealType: formData.get("meal-type"),
      foodItems: formData.get("food-items"),
      calories: Number.parseInt(formData.get("calories") as string),
    }

    try {
      // Replace this URL with your n8n webhook URL
      const webhookUrl = "https://mmg997.app.n8n.cloud/webhook/meal-logger"

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      })

      if (response.ok) {
        alert("Meal logged successfully!")
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      } else {
        alert("Error logging meal. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error logging meal. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Utensils className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Log Your Meal</CardTitle>
          <CardDescription>Track your daily food intake and calories</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                  name="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  defaultValue={new Date().toTimeString().slice(0, 5)}
                  required
                  name="time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select required name="meal-type">
                <SelectTrigger id="meal-type">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="drink">Drink</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="food-items">Food Items</Label>
              <Textarea
                id="food-items"
                placeholder="List the foods you ate (e.g., grilled chicken breast, brown rice, steamed broccoli)"
                className="min-h-[100px] resize-none"
                required
                name="food-items"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="Enter total calories"
                min="0"
                max="5000"
                required
                name="calories"
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log Meal
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
