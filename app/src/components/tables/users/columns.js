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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import config from "@/config"
import Link from "next/link"
import EditUserSheet from "@/components/sheets/edit-user-sheet"
import { SheetTrigger } from "@/components/ui/sheet"
import React from "react"

export const roles = ['Admin', 'Student', 'Teacher'];

export const columns = [
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>Last Name</span>
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="px-4">{user.last_name}</span>
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
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="px-4">{user.first_name}</span>
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
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="px-4">{user.email}</span>
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
      return <ActionsCell user={user} />;
    }
  }
]

function ActionsCell({ user }) {
  const userRole = user['role'];
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${config.backendUrl}/users`, {
        params: { id: user.id },
      });
      console.log('User deleted successfully:', response.data);

      setDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <EditUserSheet user={user} open={sheetOpen} onOpenChange={setSheetOpen}>
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
              <DropdownMenuItem asChild>
                <Link href={`student/${user.id}`}>
                  View Student&apos;s Profile
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
              <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                Modify Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Delete Student
              </DropdownMenuItem>
            </div>
          ) : userRole === 'Teacher' ? (
            <div>
              <DropdownMenuItem asChild>
                <Link href={`teacher/${user.id}`}>
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                Modify Teacher
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Delete Teacher
              </DropdownMenuItem>
            </div>
          ) : (
            <div>
              <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                Modify Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Delete Admin
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EditUserSheet>
  )
}