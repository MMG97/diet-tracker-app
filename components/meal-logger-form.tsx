"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function MealLoggerForm() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedMealsCount, setSavedMealsCount] = useState(0)

  // Load user's meal count
  useEffect(() => {
    if (!user) return

    try {
      const userMealsKey = `meals_${user.email}`
      const userMeals = JSON.parse(window.localStorage.getItem(userMealsKey) || "[]")
      setSavedMealsCount(userMeals.length)
    } catch (error) {
      console.error("Error loading user meals:", error)
    }
  }, [user])

  // Function to view saved meals (for debugging/verification)
  const viewSavedMeals = () => {
    if (!user) return

    const userMealsKey = `meals_${user.email}`
    const savedMeals = JSON.parse(window.localStorage.getItem(userMealsKey) || "[]")
    console.log("Saved meals for", user.email, ":", savedMeals)
    toast({
      title: "Check Console",
      description: `Found ${savedMeals.length} saved meals. Check browser console for details.`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const mealData = {
      date: formData.get("date"),
      time: formData.get("time"),
      mealType: formData.get("meal-type"),
      foodItems: formData.get("food-items"),
      calories: Number(formData.get("calories")),
      name: user.name, // Add user's name from signup
      email: user.email, // Add user's email from signup
      phone: user.phone, // Add user's phone from signup
      userEmail: user.email, // Keep for backward compatibility
      userName: user.name, // Keep for backward compatibility
      timestamp: new Date().toISOString(),
    }

    // Save to user-specific localStorage key
    try {
      const userMealsKey = `meals_${user.email}`
      const existingMeals = JSON.parse(window.localStorage.getItem(userMealsKey) || "[]")
      existingMeals.push(mealData)
      window.localStorage.setItem(userMealsKey, JSON.stringify(existingMeals))
      setSavedMealsCount(existingMeals.length)
      console.log("Meal saved for user:", user.email, mealData)
    } catch (localError) {
      console.error("Failed to save locally:", localError)
    }

    // Try to send to webhook (if available)
    try {
      // Replace this with your actual n8n webhook URL when ready
      const webhookUrl = "https://mmg997.app.n8n.cloud/webhook/meal-logger"

      // Check if webhook URL is properly configured
      if (!webhookUrl || webhookUrl === "YOUR_N8N_WEBHOOK_URL_HERE" || webhookUrl === "") {
        console.log("Webhook URL not configured, using offline mode")
        throw new Error("Webhook not configured")
      }

      console.log("Attempting to send data to webhook:", mealData)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(mealData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        console.log("Successfully sent to webhook")
        toast({
          title: "Success!",
          description: "Your meal has been logged and synced to the cloud.",
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.log("Webhook failed, using offline mode:", error)

      toast({
        title: "Meal Logged",
        description: "Your meal has been saved successfully.",
      })
    }

    // Reset form
    try {
      const form = e.target as HTMLFormElement

      const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement
      const timeInput = form.querySelector('input[name="time"]') as HTMLInputElement
      const caloriesInput = form.querySelector('input[name="calories"]') as HTMLInputElement
      const foodItemsInput = form.querySelector('textarea[name="food-items"]') as HTMLTextAreaElement

      if (dateInput) dateInput.value = new Date().toISOString().split("T")[0]
      if (timeInput) timeInput.value = new Date().toTimeString().slice(0, 5)
      if (caloriesInput) caloriesInput.value = ""
      if (foodItemsInput) foodItemsInput.value = ""
    } catch (resetError) {
      console.error("Form reset error:", resetError)
    }

    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Utensils className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <CardTitle className="text-center">Meal Logger</CardTitle>
        <CardDescription className="text-center">Track your daily food intake and calories</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Date
              </Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input id="time" name="time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select name="meal-type" required>
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
              name="food-items"
              placeholder="List the foods you ate (e.g., grilled chicken breast, brown rice, steamed broccoli)"
              className="min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              placeholder="Enter total calories"
              min="0"
              max="5000"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={viewSavedMeals} className="flex-1">
            View Saved ({savedMealsCount})
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Meal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
