"use client"
import React, { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import EditStudentForm from "../forms/user/edit-student"
import EditTeacherForm from "../forms/user/edit-teacher"
import EditAdminForm from "../forms/user/edit-admin"

export default function EditUserSheet({ children, user, open, onOpenChange }) {
    const [userData, setUserData] = React.useState({});
    const formRef = React.useRef(null);

    useEffect(() => {
        setUserData({
            ...user,
            birth_date: {
                month: String(new Date(user.birth_date).getMonth() + 1),
                day: String(new Date(user.birth_date).getDate() + 1),
                year: String(new Date(user.birth_date).getFullYear()),
            }
        });
    }, [user]);

    const handleFormSubmit = () => {
        // Trigger the form's submit function programmatically
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {children}
            {/* Make the SheetContent a flex container */}
            <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>
                        Modify user details and save changes.
                    </SheetDescription>
                </SheetHeader>

                {/* This div will contain the form, grow, and become scrollable */}
                <div className="flex-grow overflow-y-auto pr-4 my-4 mx-2 border rounded-lg">
                    {user.role === 'Teacher' && (
                        <EditTeacherForm 
                            teacher={userData} 
                            setOpen={onOpenChange} 
                            formRef={formRef} 
                        />
                    )}
                    {user.role === 'Student' && (
                        <EditStudentForm 
                            student={userData} 
                            setOpen={onOpenChange} 
                            formRef={formRef} 
                        />
                    )}
                    {user.role === 'Admin' && (
                        <EditAdminForm
                            admin={userData}
                            setOpen={onOpenChange}
                            formRef={formRef}
                        />
                    )}
                </div>

                <SheetFooter className="flex flex-row-reverse justify-between mt-auto pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleFormSubmit}>Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}