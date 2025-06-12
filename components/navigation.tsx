"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Log Meal",
      href: "/",
      icon: <UtensilsCrossed className="h-5 w-5" />,
    },
    {
      name: "Summary",
      href: "/summary",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Trends",
      href: "/trends",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <UtensilsCrossed className="h-6 w-6 text-green-600" />
          <span className="ml-2 text-lg font-bold">Diet Tracker</span>
        </div>
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="md:hidden">
        <nav className="flex items-center justify-around border-t">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center py-2 text-xs font-medium transition-colors",
                pathname === item.href
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500",
              )}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
