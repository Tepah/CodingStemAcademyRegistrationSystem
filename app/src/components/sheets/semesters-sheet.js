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
import { Button } from "@/components/ui/button"
import { ModifySemesterForm } from "../forms/semester/edit-form"

export const EditSemesterSheet = ({ children, semesterData, sheetOpen, setSheetOpen }) => {
    const formRef = React.useRef(null);

    
    const handleFormSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            {children}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Semester</SheetTitle>
                    <SheetDescription>
                        Modify semester details and save changes.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto pr-4 my-4 mx-2 border rounded-lg">
                    <ModifySemesterForm semester={semesterData} onCancel={() => setSheetOpen(false)} formRef={formRef} />
                </div>
                <SheetFooter className="flex flex-row-reverse justify-between mt-auto pt-4">
                    <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
                    <Button onClick={handleFormSubmit}>Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}