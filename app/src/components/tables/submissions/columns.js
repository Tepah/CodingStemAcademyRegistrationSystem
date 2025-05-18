"use client"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import React from "react"
import { Input } from "@/components/ui/input"
import { SubmissionDialog } from "@/components/dialogs/SubmissionDialog"
import { EditScoreDialog } from "@/components/dialogs/editScoreDialog"

export const columns = [
    {
        accessorKey: "student_name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span>Student</span>
            </Button>
        )
    },
    {
        accessorKey: "submission_date",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span>Submission Date</span>
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.submission_date);
            return date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        },
    },
    {
        accessorKey: "content",
        header: ({ column }) =>
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span>Content</span>
            </Button>

    },
    {
        accessorKey: "grade",
        header: ({ column }) =>
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span>Grade</span>
            </Button>,
        cell: ({ row }) => {
            const grade = row.original.grade;
            const total = row.original.total_points;

            if (grade === null) {
                return (
                    <div className="flex flex-row items-center justify-center space-x-2">
                        <Input className="w-[100px]" type="text" value="0" readOnly />
                        <p>/{total}</p>
                    </div>
                )
            }

            return (
                <div className="flex flex-row items-center justify-center space-x-2">
                    <Input className="w-[100px]" type="text" value={grade} readOnly />
                    <p>/{total}</p>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const submissionsData = row.original;
            console.log("Submissions Data:", submissionsData);

            if (submissionsData.grade === null) {
                return (
                    <SubmissionDialog submission={submissionsData}>
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
                                    <DialogTrigger >
                                        Grade Submissions
                                    </DialogTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SubmissionDialog>
                )
            } else {
                return (
                    <EditScoreDialog submission={submissionsData}>
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
                                    <DialogTrigger >
                                        Edit Submission
                                    </DialogTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </EditScoreDialog>
                )
            }
        }
    }
]
