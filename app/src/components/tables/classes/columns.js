"use client"
import { MoreHorizontal, Trash } from "lucide-react" 
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
import { deleteClass } from "@/components/api"
import { ClassModifySheet } from "@/components/sheets/classes-sheet"
import { SheetTrigger } from "@/components/ui/sheet"


export const columns = [
    {
        accessorKey: "teacher_name",
        header: ({ column} ) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Teacher</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "class_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Class</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "subject",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Subject</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "student_count",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Student Count</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    {row.original.student_count}
                </div>
            )
        }
    }, 
    {
        accessorKey: "day",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Day</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "start_time",
        header: "Start Time",
    },
    {
        accessorKey: "end_time",
        header: "End Time",
    },
    {
        accessorKey: "semester",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Semester</span>
                </Button>
            )
        }
    },
    {
    id: "actions",
    cell: ({ row }) => {
        const classData = row.original;
        return (
            <ClassModifySheet classData={classData}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/classes/${classData.id}`} asChild>View Class</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SheetTrigger>Modify Class</SheetTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => 
                            deleteClass(classData.id)
                            .then(() => {
                                console.log("Class deleted")
                                window.location.reload()
                            })
                        }>
                            Delete class
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ClassModifySheet>
        )
    }
    }
]
