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


export const columns = [
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
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Title</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => {
            return (
                <Button className="" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Due Date</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.due_date);
            return date.toLocaleString("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
    },
    {
        accessorKey: "teacher_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Teacher</span>
                </Button>
            )
        }, 
        cell: ({ row }) => {
            const data = row.original;
            return data['teacher_gender'] === 'Male' ? "Mr. " + data['teacher_name'] : "Ms. " + data['teacher_name'];
        }
    },
    {
    id: "actions",
    cell: ({ row }) => {
        const assignmentData = row.original;
        return (
            <DropdownMenu>
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
                        <Link href={`/classes/${assignmentData['class_id']}/assignments/${assignmentData['id']}`}>
                            View Assignment
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    }
]
