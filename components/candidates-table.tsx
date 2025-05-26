"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { candidates } from "@/lib/data"

// Define the status badge colors
const statusColors = {
  Applied: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Screening: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Interview: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Offer: "bg-green-100 text-green-800 hover:bg-green-100",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-100",
}

export default function CandidatesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState("appliedDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const itemsPerPage = 10

  // Get the active filter from localStorage or default to "All"
  const [activeFilter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeJobFilter") || "All"
    }
    return "All"
  })

  // Sort and filter candidates
  const filteredCandidates = candidates
    .filter((candidate) => activeFilter === "All" || candidate.role === activeFilter)
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "appliedDate") {
        return sortDirection === "asc"
          ? new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
          : new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
      } else if (sortField === "role") {
        return sortDirection === "asc" ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)
      }
      return 0
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage)

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="min-w-[150px]">
                <button className="flex items-center font-semibold" onClick={() => handleSort("name")}>
                  Name {renderSortIcon("name")}
                </button>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <button className="flex items-center font-semibold" onClick={() => handleSort("role")}>
                  Role {renderSortIcon("role")}
                </button>
              </TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[150px]">
                <button className="flex items-center font-semibold" onClick={() => handleSort("appliedDate")}>
                  Applied Date {renderSortIcon("appliedDate")}
                </button>
              </TableHead>
              <TableHead className="min-w-[100px]">Experience</TableHead>
              <TableHead className="min-w-[200px]">Skills</TableHead>
              <TableHead className="min-w-[100px]">Location</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCandidates.map((candidate, index) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{candidate.email}</div>
                </TableCell>
                <TableCell>{candidate.role}</TableCell>
                <TableCell>
                  <Badge className={statusColors[candidate.status]}>{candidate.status}</Badge>
                </TableCell>
                <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                <TableCell>{candidate.experience} years</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{candidate.location}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Send email</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Schedule interview</DropdownMenuItem>
                      <DropdownMenuItem>Change status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredCandidates.length)}</span> of{" "}
          <span className="font-medium">{filteredCandidates.length}</span> candidates
        </div>

        <div className="flex items-center space-x-6">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum = currentPage
                if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
