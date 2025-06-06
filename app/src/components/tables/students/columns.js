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
import { deleteStudentFromClass } from "@/components/api/api"

export const columns = [
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
        id: "actions",
        cell: ({ row }) => {
            const data = row.original;
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
                        <DropdownMenuItem asChild>
                            <Link href={`/classes/${data.class_id}/student/${data.id}`}>
                                View Grade
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/users/student/${data.id}`}>
                                View Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            deleteStudentFromClass(data['class_id'], data['id'])
                            .then((response) => {
                                console.log(response);
                                window.location.reload();
                            })
                            .catch((error) => {
                                console.error("Error removing student from class:", error);
                            });
                        }}>
                            Remove student
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
      }
]
