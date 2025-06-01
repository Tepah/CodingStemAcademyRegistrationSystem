import React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import EditAssignmentForm from "../forms/assignment/edit"



export default function AssignmentModifySheet({ children, assignmentData }) {

  return (
    <Sheet>
        <SheetTrigger asChild>
        {children}
        </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Assignment</SheetTitle>
          <SheetDescription>
            Make changes to the Assignment here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <SheetContent>
          <div className="grid gap-4 p-8">
            <EditAssignmentForm assignmentData={assignmentData} />
          </div>
        </SheetContent>
      </SheetContent>
    </Sheet>
  )
}
