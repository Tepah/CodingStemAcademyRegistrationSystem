"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EditSemesterSheet } from "@/components/sheets/semesters-sheet";
import { SheetTrigger } from "@/components/ui/sheet";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Semester Name",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
        const date = new Date(row.original.start_date);
        return date.toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
        const date = new Date(row.original.end_date);
        return date.toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const SemesterData = row.original;
        return (
            <EditSemesterSheet semesterData={SemesterData}>
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
                            <Link href={`/admin/semesters/${SemesterData.id}`}>
                                <p>View Details</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <SheetTrigger>
                                <p>Modify Semester</p>
                            </SheetTrigger>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </EditSemesterSheet>
        )}
    }
]