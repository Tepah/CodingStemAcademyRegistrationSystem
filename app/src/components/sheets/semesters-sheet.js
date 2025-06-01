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

export const EditSemesterSheet = ({ children, semesterData, sheetOpen, setSheetOpen }) => {

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            {children}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Semester</SheetTitle>
                    <SheetDescription>
                        Make changes to the semester here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <SheetContent>
                    <div className="grid gap-4 p-8">
                        <ModifySemesterForm semester={semesterData} onCancel={() => setSheetOpen(false)} />
                    </div>
                </SheetContent>
            </SheetContent>
        </Sheet>
    )
}