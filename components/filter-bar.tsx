"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { jobRoles } from "@/lib/data"

export function FilterBar() {
  // Get the active filter from localStorage or default to "All"
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeJobFilter") || "All"
    }
    return "All"
  })

  // Update localStorage when filter changes
  useEffect(() => {
    localStorage.setItem("activeJobFilter", activeFilter)
    // Force a re-render of the table component by dispatching a custom event
    window.dispatchEvent(new Event("storage"))
  }, [activeFilter])

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search candidates..." className="pl-8 bg-white" />
      </div>
      <div className="flex gap-2">
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            {jobRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-white">
          More Filters
        </Button>
      </div>
    </div>
  )
}
