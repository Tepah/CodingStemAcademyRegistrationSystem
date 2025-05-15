"use client"
import { useState } from "react"
import {
    ColumnDef,
    ColumnFilterState,
    flexRender,
    getPaginationRowModel,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import config from "@/config"
import { useRouter } from "next/router"



export function DataTable({ columns, data, onClick }) {
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const router = useRouter()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const handleClick = () => {
        // const token = localStorage.getItem('token');
        // const user = jwtDecode(token);
        // const student_id = user['sub']['id'];
        // const selectedClasses = Object.keys(rowSelection).map((key) => {
        //     const row = table.getRowModel().rows.find((row) => row.id === key);
        //     if (row) {
        //         return row.original.id;
        //     }
        //     return null;
        // }
        // ).filter((id) => id !== null);
        // if (selectedClasses.length === 0) {
        //     alert("Please select at least one class to register");
        //     return;
        // }
    
        // console.log("Registering for classes: " + selectedClasses + " for student: " + student_id)
        // axios.post(`${config.backendUrl}/add_multiple_classes_to_student`, {
        //     user_id: student_id,
        //     classes: selectedClasses,
        // }).then(response => {
        //     console.log("Successfully registered for class: " + response.data['message']);
        //     if (response.data['message'] === 'Student already registered for this class') {
        //     alert("You are already registered for this class");
        //     } else {
        //     console.log("Successfully registered for class: " + response.data['message']);
        //     router.push('/dashboard').then(() => console.log("Redirecting to dashboard"));
        //     }
        // }).catch(error => {
        //     console.log(error);
        // });
        const selectedClasses = Object.keys(rowSelection).map((key) => {
            const row = table.getRowModel().rows.find((row) => row.id === key);
            if (row) {
                return row.original;
            }
            return null;
        }

        ).filter((id) => id !== null);
        onClick(selectedClasses);
        setRowSelection({});
        }

    return (
        <div className="">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : (
                                                    <div className="flex items-center justify-between">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>)}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <Button onClick={() => handleClick()}>Add Classes</Button>
                <div className="flex items-center justify-end gap-4">

                    <span className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
                </div>
        </div>
    );
}