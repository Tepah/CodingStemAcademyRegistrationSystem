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
import { Input } from "@/components/ui/input"
import { useEffect } from "react"


export function DataTable({ children, columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [activeStatus, setActiveStatus] = useState("Active");
  const [columnVisibility, setColumnVisibility] = useState({status: false});

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
      columnVisibility
    },
  });

  useEffect(() => {
    if (activeStatus === "Active") {
      table.setColumnFilters((old) =>
        old.filter((f) => f.id !== "status")
      );
    } else {
      table.setColumnFilters([
        { id: "status", value: activeStatus },
      ]);
    }
  }, [activeStatus, table]);

  return (
    <div>
      <div className="flex items-center py-4 space-x-2">
        <div className="flex-1 flex flex-row justify-between">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue()) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center space-x-2">
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button 
          variant="default"
          size="sm"
          onClick={() => {
            if (activeStatus === "Active") {
              setActiveStatus("Inactive");
              table.setColumnFilters((old) =>
                old.filter((f) => f.id !== "status")
              );
            } else {
              setActiveStatus("Active");
              table.setColumnFilters((old) => [
                ...old,
                { id: "status", value: activeStatus },
              ]);
            }
          }}
          >
            {activeStatus !== "Active" ? "See Active Users" : "See Inactive Users"}
        </Button>


        <div className="flex items-center space-x-2">
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
    </div>
  );
}