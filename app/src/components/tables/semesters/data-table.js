"use client"
import {
    ColumnDef,
    SortingState,
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
import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"


export function DataTable({ columns, data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [activeStatus, setActiveStatus] = useState(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div>
            <div className="flex items-center space-x-2">
                <div className="flex flex-row flex-1 items-center space-x-2 py-4">
                    <span>Status:</span>
                    <Button
                        variant={activeStatus === "Ongoing" ? "default" : "outline"}
                        value="Ongoing"
                        size="sm"
                        onClick={(e) => {
                            if (activeStatus === e.currentTarget.value) {
                                setActiveStatus(null);
                                table.setColumnFilters((old) =>
                                    old.filter((f) => f.id !== "status")
                                );
                                return;
                            }
                            const selectedStatus = e.currentTarget.value;
                            setActiveStatus(selectedStatus);
                            table.setColumnFilters((old) => [
                                ...old,
                                { id: "status", value: selectedStatus },
                            ]);
                        }}
                    >
                        Ongoing
                    </Button>
                    <Button
                        variant={activeStatus === "Upcoming" ? "default" : "outline"}
                        size="sm"
                        value="Upcoming"
                        onClick={(e) => {
                            if (activeStatus === e.currentTarget.value) {
                                setActiveStatus(null);
                                table.setColumnFilters((old) =>
                                    old.filter((f) => f.id !== "status")
                                );
                                return;
                            }
                            const selectedStatus = e.currentTarget.value;
                            setActiveStatus(selectedStatus);
                            table.setColumnFilters((old) => [
                                ...old,
                                { id: "status", value: selectedStatus },
                            ]);
                        }}

                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={activeStatus === "Complete" ? "default" : "outline"}
                        value="Complete"
                        size="sm"
                        onClick={(e) => {
                            if (activeStatus === e.currentTarget.value) {
                                setActiveStatus(null);
                                table.setColumnFilters((old) =>
                                    old.filter((f) => f.id !== "status")
                                );
                                return;
                            }
                            const selectedStatus = e.currentTarget.value;
                            setActiveStatus(selectedStatus);
                            table.setColumnFilters((old) => [
                                ...old,
                                { id: "status", value: selectedStatus },
                            ]);
                        }}
                    >
                        Complete
                    </Button>
                </div>
            </div>

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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Link href="semesters/create">
                    <Button size="sm">Create Semester</Button>
                </Link>
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
    );
}