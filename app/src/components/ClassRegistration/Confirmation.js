"use client"
import React from 'react';
import { Card } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { useRouter } from 'next/navigation';
import config from '@/config';


export default function Confirmation(props) {
    const [openDialog, setOpenDialog] = React.useState(false);
    const router = useRouter();

    const handleConfirmRegistration = () => {
        props.setLoading(true);
        const student_id = props.student_id;
        const newClasses = props.pickedClasses.filter((classData) => !props.currentClasses.some((currentClass) => currentClass.id === classData.id)).map((classData) => classData.id);
        const removedClasses = props.currentClasses.filter((classData) => !props.pickedClasses.some((pickedClass) => pickedClass.id === classData.id)).map((classData) => classData.id);

        console.log("New classes:", newClasses);
        console.log("Removed classes:", removedClasses);

        if (newClasses.length === 0 && removedClasses.length === 0) {
            alert("No changes made to your class schedule.");
            return;
        }
        const promises = [];
        newClasses.forEach((class_id) => {
            promises.push(axios.post(`${config.backendUrl}/add_student_to_class`, {
                user_id: student_id,
                class_id: class_id,
            }).then((response) => {
                console.log("Class registered successfully:", response.data);
            }).catch((error) => {
                console.error("Error registering class:", error);
            }))
        })

        removedClasses.forEach((class_id) => {
            promises.push(axios.delete(`${config.backendUrl}/delete-student-from-class`, {
                params: {
                    user_id: student_id,
                    class_id: class_id,
                },
            }).then((response) => {
                console.log("Class removed successfully:", response.data);
            }).catch((error) => {
                console.error("Error removing class:", error);
            }))
        });

        promises.push(axios.post(`${config.backendUrl}/payment`, {
            student_id: student_id,
            amount: props.donations,
            notes: "Class registration",
            payment_date: new Date().toISOString(),
            payment_type: "Cash",
            payment_status: "Balance",
        }))

        Promise.all(promises).then(() => {
            console.log("All class registrations completed successfully.");
            props.setLoading(false);
            setOpenDialog(true);
        })
    }

    return (
        <div className="flex flex-col container mx-auto p-8 items-center">
            <h1 className="text-2xl font-bold mb-4">Confirm Class Registration</h1>
            <p className="text-center">Please review your selected classes before proceeding.</p>
            <div className="flex flex-col md:flex-row flex-1 gap-4 mt-4">
                <Card className="">
                    <Table>
                        <TableCaption>Current Class Schedule</TableCaption>
                        <TableHeader>
                            <TableHead>Subject</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Time</TableHead>
                        </TableHeader>
                        <TableBody>
                            {props.currentClasses.map((classData) => (
                                <TableRow key={classData.id}>
                                    <TableCell>{classData.subject}</TableCell>
                                    <TableCell>{classData.teacher.first_name}</TableCell>
                                    <TableCell className="text-sm whitespace-normal">{classData.day}<br/>{classData.start_time} - {classData.end_time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                <p className="text-center flex flex-col justify-center">To</p>
                <Card className="">
                    <Table>
                        <TableCaption>New Class Schedule</TableCaption>
                        <TableHeader>
                            <TableHead>Subject</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Time</TableHead>
                        </TableHeader>
                        <TableBody>
                            {props.pickedClasses.map((classData) => (
                                <TableRow key={classData.id}>
                                    <TableCell>{classData.subject}</TableCell>
                                    <TableCell>{classData.teacher.first_name}</TableCell>
                                    <TableCell className="text-sm whitespace-normal">{classData.day}<br />{classData.start_time} - {classData.end_time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
            <Dialog open={openDialog}>
                <Button size="sm" variant="default" className="mt-4" onClick={() => handleConfirmRegistration()} disabled={!props.loading}>
                    Confirm Registration
                </Button>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            The Student&apos;s schedule has been set for the semester.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => {router.push(`/admin/classes/student/${props.student_id}`)}}>Okay</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}