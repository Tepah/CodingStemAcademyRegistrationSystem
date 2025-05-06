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
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useMemo } from "react"

export function  DataTable({children, columns, data}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [activeTeacher, setActiveTeacher] = useState(null);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (activeClass) {
      filtered = filtered.filter((row) => row.class_name === activeClass);
    }

    if (activeTeacher) {
      filtered = filtered.filter((row) => row.teacher_name === activeTeacher);
    }

    return filtered;
  }, [data, activeClass, activeTeacher]);

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
      <div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center py-4 space-x-2">
            <Select 
              value={activeClass}
              onValueChange={(value) => {
                setActiveClass(value);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Class">
                  {activeClass || "Class"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[...new Set(data.map((row) => (row.class_name)))].map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={activeTeacher}
              onValueChange={(value) => {
                setActiveTeacher(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Teacher">
                  {activeTeacher ? activeTeacher : "Teacher"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[...new Set(data.map((row) => (row.teacher_name)))].map((teacherName) => (
                  <SelectItem key={teacherName} value={teacherName}>
                    {teacherName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="ml-2" variant="default" size="sm" 
            onClick={() => {
              setActiveClass(null);
              setActiveTeacher(null);
            }}>
            Clear Filters
          </Button>
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
          {children}
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