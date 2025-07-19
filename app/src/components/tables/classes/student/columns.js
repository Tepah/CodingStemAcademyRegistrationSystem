"use client"
import { MoreHorizontal, Trash } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { deleteStudentFromClass } from "@/components/api/api"


export const createColumns = (onStudentRemoved) => [
    {
        accessorKey: "teacher_name",
        header: "Teacher",
    },
    {
        accessorKey: "class_name",
        header: "Class Name",
    },
    {
        accessorKey: "subject",
        header: "Subject",
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
    id: "actions",
    cell: ({ row }) => {
        const classData = row.original;

        return (
            <Button 
                onClick={() => 
                    deleteStudentFromClass(classData["id"], classData["student_id"])
                    .then(() => {
                        console.log("Student removed from class successfully");
                        onStudentRemoved();
                    })}
                variant="ghost" 
                className="h-8 w-8 p-0">
                <Trash className="h-4 w-4" />
            </Button>
        )
    }
    }
]
