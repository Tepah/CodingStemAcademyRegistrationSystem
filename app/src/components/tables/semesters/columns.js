"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Delete, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EditSemesterSheet } from "@/components/sheets/semesters-sheet";
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
import { deleteSemester } from "@/components/api/api";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

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
            return <ActionsCell semesterData={SemesterData} />;
        }
    }
]


const DeleteSemesterDialog = ({ children, semester, open, setOpen }) => {

    const handleDelete = async () => {
        try {
            await deleteSemester(semester.id);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting semester:", error);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ActionsCell({ semesterData }) {
    const [open, setOpen] = React.useState(false);
    const [sheetOpen, setSheetOpen] = React.useState(false);

    return (
        <EditSemesterSheet semesterData={semesterData} sheetOpen={sheetOpen} setSheetOpen={setSheetOpen}>
            <DeleteSemesterDialog semester={semesterData} open={open} setOpen={setOpen}>
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
                            <Link href={`/admin/semesters/${semesterData.id}`}>
                                <p>View Details</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                            <p>Modify Semester</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setOpen(true); }}>
                            <p>Delete Semester</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </DeleteSemesterDialog>
        </EditSemesterSheet>
    );
}