"use client"
import {
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
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useMemo } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { set } from "date-fns"

 

export function  DataTable({columns, data, semester}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeSemester, setActiveSemester] = useState(null);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (activeSemester === "All") {
      filtered = data;
    } else if (activeSemester) {
      filtered = filtered.filter((row) => row.semester === activeSemester);
    }
    return filtered;
  }, [data, activeSemester]);

  useEffect(() => {
    setActiveSemester(semester);
  }, [semester]);

  const table = useReactTable({
      data: filteredData,
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
      <div className="py-4 flex flex-col space-y-4">
        <div className="flex flex-row">
          <Select
            value={activeSemester}
            onValueChange={(value) => {
              setActiveSemester(value);
            }}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select semester">
                {activeSemester || "Select semester"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {[...new Set(data.map((row) => (row.semester)))].map((semesterName) =>(
                <SelectItem key={semesterName} value={semesterName}>
                  {semesterName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Link href={`/admin/classes/create`}>
            <Button variant="default" size="sm">
              Add class
            </Button>
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