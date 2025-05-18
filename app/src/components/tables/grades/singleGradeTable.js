"use client"
import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchAssignments } from '@/components/api/api';
import Link from "next/link";


const getGrade = (percent) => {
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
}

export default function SingleGradeTable({ student_id, class_id, personal = false }) {
    const [assignments, setAssignments] = useState([]);
    const [student, setStudent] = useState(null);
    const [className, setClassName] = useState(null);
    const [overallTotal, setOverallTotal] = useState(0);
    const [overallScore, setOverallScore] = useState(0);
    const [overallPercent, setOverallPercent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [grade, setGrade] = useState(null);

    useEffect(() => {
        if (!class_id) { return; }

        Promise.all([
            fetchAssignments(class_id, student_id)
                .then((res) => {
                    setAssignments(res.assignments);
                    setClassName(res.class.class_name);
                    setOverallTotal(res.totalPoints);
                    setOverallScore(res.totalScore);
                    setOverallPercent(res.totalScore / res.totalPoints * 100);
                    setGrade(getGrade(res.totalScore / res.totalPoints * 100));
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                }),
            axios.get(`${config.backendUrl}/user`, { params: { id: student_id } })
                .then((res) => {
                    setStudent(res.data.user);
                })
        ])
            .finally(() => {
                setLoading(false);
            });
    }, [class_id, student_id]);

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
        <div className="container max-w-[900px] mx-auto flex flex-col p-4 gap-4">
            <h1 className="text-2xl font-bold">{!personal && (`${student.first_name} ${student.last_name}`)} {className} Grades</h1>
            <Card>
                <Table>
                    <TableCaption>
                        {personal ? "Your " : `${student.first_name} ${student.last_name} `}grades for {className}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4 text-left w-[200px]">Assignment</TableHead>
                            <TableHead className="text-left w-[80px]">Due</TableHead>
                            <TableHead className="text-left w-[60px]">Score</TableHead>
                            <TableHead className="text-left w-[60px]">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    {assignments.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-left">No assignments found</TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="py-4 text-left">
                                        <Link href={`/classes/${class_id}/assignments/${assignment.id}`}>
                                            {assignment.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-4 text-left">

                                        <Link href={`/classes/${class_id}/assignments/${assignment.id}`}>
                                            {new Date(assignment.due_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                timeZone: "UTC", // Force UTC interpretation
                                            })}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-left">

                                        <Link href={`/classes/${class_id}/assignments/${assignment.id}`}>
                                            {assignment.score ? assignment.score.grade : assignment.score ? assignment.score.grade : 'N/A'}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <Link href={`classes/${class_id}/assignments/${assignment.id}`}>
                                            {assignment.total_points}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell className="py-8 text-lg text-left font-bold">Overall Score</TableCell>
                                <TableCell className="text-left"></TableCell>
                                <TableCell className="text-left">{overallScore ? overallScore.toFixed(0) : 0}/{overallTotal}</TableCell>
                                <TableCell className="text-left font-semibold">{overallPercent.toFixed(2)}%({grade})</TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </Card>
        </div>
    )
}