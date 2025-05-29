"use client"
import React, { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import EditStudentForm from "../forms/user/edit-student"

export default function EditUserSheet({ children, user }) {
    const [userData, setUserData] = React.useState({});

    useEffect(() => {
        setUserData({
            ...user,
            birth_date: {
                month: new Date(user.birth_date).getMonth() + 1,
                day: new Date(user.birth_date).getDate() + 1,
                year: new Date(user.birth_date).getFullYear(),
            }
        });
    }, []);

    return (
        <Sheet>
            {children}
            <SheetContent side="right" className="w-[400px]">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>
                        Modify user details and save changes.
                    </SheetDescription>
                    {/* {user.role === 'Teacher' && (
                        <EditTeacherForm user={user} />
                    )} */}
                    {user.role === 'Student' && (
                        <EditStudentForm student={userData} onSubmit={(data) => console.log(data)} />
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}