"use client"


export const columns = (assignments) => {
    const baseColumns = [
        {
            accessorKey: "last_name",
            header: () => <div className="w-[100px]">Last Name</div>,
            cell: ({ row }) => {
                const lastName = row.original.last_name;
                return (
                    <div className="w-[100px]">
                        {lastName.length > 10 ? `${lastName.slice(0, 10)}...` : lastName}
                    </div>
                );
            },
        },
        {
            accessorKey: "first_name",
            header: () => <div className="w-[100px]">First Name</div>,
            cell: ({ row }) => {
                const firstName = row.original.first_name;
                return (
                    <div className="w-[100px]">
                        {firstName.length > 10 ? `${firstName.slice(0, 10)}...` : firstName}
                    </div>
                );
            },
        },
    ];

    const assignmentColumns = assignments.map((assignment, index) => ({
        accessorKey: `assignment_${assignment.id}`, // Unique key for each assignment
        header: () => <div className="text-center">{index + 1}</div>, // Assignment header (e.g., 1, 2, 3)
        cell: ({ row }) => {
            console.log("Row data:", row.original); // Log the row data for debugging
            const studentAssignments = row.original.assignments; // Access the student's assignments
            const assignmentData = studentAssignments.find((a) => a.id === assignment.id); // Match assignment by ID
            const today = new Date();
            const dueDate = new Date(assignment.due_date);
            const isOverdue = today > dueDate; // Check if the assignment is overdue
            const grade = assignmentData.scores ? assignmentData?.scores.grade/assignmentData.total_points : isOverdue ? 0 : "N/A"; // Get the score or show "N/A" if not available
            return (
                <div className="flex items-center justify-center border-l border-gray-300">
                    <span>{grade}</span>
                </div>
            );
        },
    }));

    const totalColumn = {
        accessorKey: "total",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => {
            const total = row.original.total;
            const getGrade = (total) => {
                if (total === null) return null;
                if (total >= 90) return "A";
                if (total >= 80) return "B";
                if (total >= 70) return "C";
                if (total >= 60) return "D";
                return "F";
            };
            return (
                <div className="flex text-right justify-end border-l">
                    {total !== null ? (
                        <span>{total}% ({getGrade(total)})</span>
                    ) : (
                        <span className="text-gray-500">N/A</span>
                    )}
                </div>
            );
        },
    };

    return [...baseColumns, ...assignmentColumns, totalColumn];
};