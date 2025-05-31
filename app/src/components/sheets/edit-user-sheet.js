"use client"
import React, { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import EditStudentForm from "../forms/user/edit-student"
import EditTeacherForm from "../forms/user/edit-teacher"

export default function EditUserSheet({ children, user }) {
    const [userData, setUserData] = React.useState({});

    useEffect(() => {
    setUserData({
        ...user,
        birth_date: {
            month: String(new Date(user.birth_date).getMonth() + 1).padStart(2, '0'),
            day: String(new Date(user.birth_date).getDate()).padStart(2, '0'),
            year: String(new Date(user.birth_date).getFullYear()),
        }
    });
}, [user]);

    return (
        <Sheet>
            {children}
            <SheetContent side="right" className="w-[400px]">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>
                        Modify user details and save changes.
                    </SheetDescription>
                    {user.role === 'Teacher' && (
                        <EditTeacherForm teacher={userData} />
                    )}
                    {user.role === 'Student' && (
                        <EditStudentForm student={userData} />
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}