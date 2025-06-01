"use client"
import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchAssignments, getCurrentSemester } from '@/components/api/api';
import { format } from 'date-fns';
import { BookCopy, Megaphone, NotepadText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";


const getGrade = (percent) => {
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
}

export default function AllStudentGradesTable({ student_id, personal = false }) {
    const [student, setStudent] = useState(null);
    const [classes, setClasses] = useState([]);
    const [semester, setSemester] = useState(null);
    const [allGrades, setAllGrades] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentSemester().then((res) => {
            console.log(res);
            setSemester(res);
        }
        ).catch((err) => {
            console.error(err);
        });
    }, []);

    useEffect(() => {
        if (!student_id || !semester) { return; }
        Promise.all([
            axios.get(`${config.backendUrl}/user`, {
                params: {
                    id: student_id,
                }
            }).then((res) => {
                setStudent(res.data['user']);
            }).catch((err) => {
                console.error(err);
            }),
            axios.get(`${config.backendUrl}/student-classes-by-semester`, {
                params: {
                    semester_id: semester.id,
                    student_id: student_id,
                }
            }).then((res) => {
                console.log(res.data);
                const updatedClasses = res.data['classes'].map(async (classItem) => {
                    const teacher = await axios.get(`${config.backendUrl}/total`, {
                        params: {
                            class_id: classItem['id'],
                            student_id: student_id,
                        }
                    });
                    classItem['grade'] = teacher.data['total'];
                    return classItem;
                }
                );
                const classes = Promise.all(updatedClasses).then((data) => {
                    console.log(data);
                    return data;
                });
                return classes;
            }).catch((err) => {
                console.error(err);
            })])
            .then((res) => {
                console.log(res);
                setClasses(res[1]);
            })
            .finally(() => {
                setLoading(false);
            })

    }, [semester, student_id]);

    const handleClick = async () => {
        const cur = !allGrades;
        setAllGrades(cur);

        if (cur) {
            try {
                const res = await axios.get(`${config.backendUrl}/all-classes-by-student`, { params: { student_id: student_id } });
                console.log(res.data);

                const updatedClasses = await Promise.all(
                    res.data['classes'].map(async (classItem) => {
                        const teacher = await axios.get(`${config.backendUrl}/total`, {
                            params: {
                                class_id: classItem['id'],
                                student_id: student_id,
                            },
                        });
                        classItem['grade'] = teacher.data['total'];
                        return classItem;
                    })
                );

                setClasses(updatedClasses); // Set the resolved data
            } catch (error) {
                console.error('Error fetching all classes:', error);
            }
        } else {
            try {
                const res = await axios.get(`${config.backendUrl}/student-classes-by-semester`, {
                    params: {
                        semester_id: semester.id,
                        student_id: student_id,
                    },
                });
                console.log(res.data);

                const updatedClasses = await Promise.all(
                    res.data['classes'].map(async (classItem) => {
                        const teacher = await axios.get(`${config.backendUrl}/total`, {
                            params: {
                                class_id: classItem['id'],
                                student_id: student_id,
                            },
                        });
                        classItem['grade'] = teacher.data['total'];
                        return classItem;
                    })
                );

                setClasses(updatedClasses); // Set the resolved data
            } catch (error) {
                console.error('Error fetching semester classes:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="w-[900px] mx-auto flex flex-col p-4">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
            </div>
        )
    }

    return (
        <div className="container mx-auto flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{!personal && (`${student.first_name} ${student.last_name}`)} Grades</h1>
            <Card>
                <Table>
                    <TableCaption>
                        {personal ? "Your " : `${student.first_name} ${student.last_name}'s `}grades
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4 text-left w-[200px]">Class</TableHead>
                            <TableHead className="text-left w-[80px]">Grade</TableHead>
                            <TableHead className="text-center justify-end w-[60px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {(classes || []).length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No classes found</TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {classes.map((classData) => (
                                <TableRow key={classData.id}>
                                    <TableCell className="py-4 text-left">{classData.class_name}</TableCell>
                                    <TableCell className="text-left">
                                        {getGrade(classData.grade)} ({parseFloat(classData.grade).toFixed(2)}%)
                                    </TableCell>
                                    <TableCell className="flex flex-row text-left justify-center space-x-4">
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link href={`/classes/${classData.id}`} className="text-center">
                                                    <BookCopy className="w-[25px] h-[25px]" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View Class</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link href={`/classes/${classData.id}/grades`} className="text-center">
                                                    <NotepadText className="w-[25px] h-[25px]" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View Assignments</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {personal && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/classes/${classData.id}/announcements`} className="text-center">
                                                        <Megaphone className="w-[25px] h-[25px]" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Announcements</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </Card>
            <p onClick={() => { handleClick() }} className="flex flex-row items-center text-sm font-semibold text-muted-foreground hover:cursor-pointer hover:text-primary">
                {!allGrades ? ("View All Grades...") : ("View Semester Grades...")}
            </p>
        </div>
    )
}