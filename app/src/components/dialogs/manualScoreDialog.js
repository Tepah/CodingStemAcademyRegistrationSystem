"use client"

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import StudentNamePopover from "../popovers/StudentNamePopover";
import { title } from "process";

const schema = z.object({
    student_id: z.number(),
    assignment_id: z.string(),
    grade: z.coerce.number().min(0).max(100),
    feedback: z.string().optional(),
})

export default function ManualScoreDialog({ assignment_id, class_id, submissions }) {
    const [students, setStudents] = React.useState([]);

    const [loading, setLoading] = React.useState(false);


    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            student_id: "",
            student_name: "",
            assignment_id: assignment_id,
            grade: 0,
            feedback: "",
        }
    })

    useEffect(() => {
        axios.get(`${config.backendUrl}/get-students-by-class`, { params: { class_id: class_id } })
            .then((response) => {
                const students = response.data.students.map((student) => ({
                    id: student.id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    email: student.email,
                })).filter((student) => {
                    return !submissions.some((submission) => submission.student_id === student.id);
                });
                setStudents(students);
                console.log("Students fetched successfully:", students);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, [class_id, submissions]);



    const handleSubmit = async (data) => {
        try {
            const submissionData = await axios.post(`${config.backendUrl}/submission`, { student_id: data.student_id, assignment_id: data.assignment_id, content: "Manually Graded" });
            data.submission_id = submissionData.data.submission_id;
            const response = await axios.post(`${config.backendUrl}/score`, data);
            const user = jwtDecode(localStorage.getItem("token"))['sub'];
            const assignment = await axios.get(`${config.backendUrl}/assignment`, { params: { id: data.assignment_id } });
            await axios.post(`${config.backendUrl}/messages`, {
                sender_user_id: user['id'],
                receiver_user_id: data.student_id,
                message: `You have received a new grade for ${assignment.data.assignment.title}.`,
                title: "New Grade Received for " + assignment.data.assignment.title,
                class_id: class_id,
            })
            console.log("Grade submitted successfully:", response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting grade:", error);
        }
    }

    const handleSelectStudent = (studentId) => {
        form.setValue("student_id", studentId);
        const selectedStudent = students.find((student) => student.id === studentId);
        if (selectedStudent) {
            form.setValue("student_name", selectedStudent.first_name + " " + selectedStudent.last_name);
        }
    }

    return (
        <Dialog>
            { loading ? (
                <Skeleton className="h-10 w-40" />
            ) : ( 
                <>
            <DialogTrigger asChild>
                <Button variant="default" className="">
                    Manually Input Grade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <DialogHeader>
                            <DialogTitle>Manual Score Input</DialogTitle>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="student_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student</FormLabel>
                                    <div className="flex flex-1 flex-row space-x-4 items-center">
                                        <Input className="w-[60px]" type="text" placeholder="ID" {...field} value={field.value} readOnly />
                                        <Input type="text" placeholder="Student Name" {...field} value={form.getValues("student_name")} readOnly />
                                    </div>
                                    <StudentNamePopover onSelectStudent={handleSelectStudent} studentsList={students} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grade</FormLabel>
                                    <Input type="number" placeholder="Enter Grade" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feedback</FormLabel>
                                    <Textarea placeholder="Enter Feedback" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
            </>)}
        </Dialog>
    )
}