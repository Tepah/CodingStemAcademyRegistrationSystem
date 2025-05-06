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
import { Input } from "@/components/ui/input"
 

export function  DataTable({children, columns, data}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeRole, setActiveRole] = useState(null);

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
        <div className="flex items-center py-4 space-x-2">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue()) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center justify-end space-x-2 py-4">
            <span>Roles:</span>
            <Button 
              variant={activeRole === "Admin" ? "default" : "outline"}
              size="sm"
              value="Admin"
              onClick={(e) => {
                if (activeRole === e.currentTarget.value) {
                  setActiveRole(null);
                  table.setColumnFilters((old) =>
                    old.filter((f) => f.id !== "role")
                  );
                  return;
                }
                const selectedRole = e.currentTarget.value;
                setActiveRole(selectedRole);
                table.setColumnFilters((old) => [
                  ...old,
                  { id: "role", value: selectedRole },
                ]);
              }}

            >
              Admin
            </Button>
            <Button 
              variant={activeRole === "Student" ? "default" : "outline"}
              value="Student"
              size="sm"
              onClick={(e) => {
                if (activeRole === e.currentTarget.value) {
                  setActiveRole(null);
                  table.setColumnFilters((old) =>
                    old.filter((f) => f.id !== "role")
                  );
                  return;
                }
                const selectedRole = e.currentTarget.value;
                setActiveRole(selectedRole);
                table.setColumnFilters((old) => [
                  ...old,
                  { id: "role", value: selectedRole },
                ]);
              }}
              >
              Student
            </Button>
            <Button
              variant={activeRole === "Teacher" ? "default" : "outline"}
              value="Teacher"
              size="sm"
              onClick={(e) => {
                if (activeRole === e.currentTarget.value) {
                  setActiveRole(null);
                  table.setColumnFilters((old) =>
                    old.filter((f) => f.id !== "role")
                  );
                  return;
                }
                const selectedRole = e.currentTarget.value;
                setActiveRole(selectedRole);
                table.setColumnFilters((old) => [
                  ...old,
                  { id: "role", value: selectedRole },
                ]);
              }}
              >
              Teacher
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