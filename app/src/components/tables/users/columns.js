"use client"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ColumnVisibility } from "@tanstack/react-table"

export const roles = ['Admin', 'Student', 'Teacher'];

export const columns = [
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>Last Name</span>
        </Button>
      )
    }
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>First Name</span>
        </Button>
      )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>Email</span>
        </Button>
      )
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const userRole = user['role'];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userRole === 'Student' ? (
              <div>
                <DropdownMenuItem asChild>
                  <Link href={`grades/${user.id}`}>
                    View Grades
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild key={user.id}>
                  <Link href={`classes/student/${user.id}`}>
                    Manage Student&apos;s Classes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`payments/${user.id}`}>
                    Manage Payments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`student/${user.id}`}>
                    Manage Student&apos;s Profile
                  </Link>
                </DropdownMenuItem>
              </div>
            ) : userRole === 'Teacher' ? (
              <div>
                <DropdownMenuItem asChild>
                  <Link href={`classes/teacher/${user.id}`}>
                    Manage Teacher&apos;s Classes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Manage Profile</DropdownMenuItem>
              </div>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
