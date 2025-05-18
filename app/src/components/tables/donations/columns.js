"use client"
import { MoreHorizontal } from "lucide-react" 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { PaymentModifySheet } from "@/components/sheets/payment-sheet"
import { SheetTrigger } from "@/components/ui/sheet"
import { deletePayment } from "@/components/api/api"


export const columns = [
    {
        accessorKey: "last_name",
        header: ({ column }) => {
            return (
                <Button className="w-[80px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Last Name</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            console.log("Row data:", row.original);
            console.log("Row data last name:", row.original.last_name);
            return <div className="text-left">{row.original.last_name || "N/A"}</div>;
        }
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button className="w-[80px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>First Name</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            console.log("Row data:", row.original);
            return row.original.first_name || "N/A";
        }
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button className="w-[80px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Amount</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = row.original.amount;
            return (
                <div className="text-center">
                    {amount ? `$${parseFloat(amount).toFixed(2)}` : "N/A"}
                </div>
            );
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button className="w-[60px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Status</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "notes",
        header: ({ column }) => {
            return (
                <Button className="w-[100px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Notes</span>
                </Button>
            )
        }
    },
    {
        accessorKey: "payment_date",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Donation Date</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.payment_date);
            return (
            <div className="text-center">
                {date.toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}
            </div>
            );
        }
    },
    {
        accessorKey: "payment_type",
        header: ({ column }) => {
            return (
                <Button className="w-[80px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span>Donation Type</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.payment_type || "N/A"}</div>;
        }
    },
    {
    id: "actions",
    cell: ({ row }) => {
        const paymentData = row.original;
        console.log("Row data:", paymentData);
        return (
            <PaymentModifySheet paymentData={paymentData}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <SheetTrigger>Modify Donation</SheetTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => 
                            deletePayment(paymentData.id)
                            .then(() => {
                                console.log("Payment deleted successfully");
                                window.location.reload();
                            })
                            .catch((error) => {
                                console.error("Error deleting payment:", error);
                            } )
                        }>
                            Delete Donation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </PaymentModifySheet>
        )
    }
    }
]
