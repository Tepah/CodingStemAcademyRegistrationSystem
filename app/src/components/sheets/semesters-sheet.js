import React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ModifySemesterForm } from "../forms/semester/edit-form"

export const EditSemesterSheet = ({ children, semesterData }) => {

    return (
        <Sheet>
            {children}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Semester</SheetTitle>
                    <SheetDescription>
                        Make changes to the semester here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <SheetContent>
                    <div className="grid gap-4 p-8">
                        <ModifySemesterForm semester={semesterData} />
                    </div>
                </SheetContent>
            </SheetContent>
        </Sheet>
    )
}