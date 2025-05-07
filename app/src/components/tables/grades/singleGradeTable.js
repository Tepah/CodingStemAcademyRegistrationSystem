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
import { fetchAssignments } from '@/components/api';
import { format } from 'date-fns';


const getGrade = (percent) => {
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
}

export default function SingleGradeTable({ data }) {
    const [user, setUser] = useState(null);
        const [assignments, setAssignments] = useState([]);
        const [loading, setLoading] = useState(true);
        const [className, setClassName] = useState(null);
        const [overallTotal, setOverallTotal] = useState(0);
        const [overallScore, setOverallScore] = useState(0);
        const [overallPercent, setOverallPercent] = useState(0);
        const [grade, setGrade] = useState(null);
        const router = useRouter();
        const { class_id } = router.query;
        
        useEffect(() => {
            const token = localStorage.getItem('token');
            setUser(jwtDecode(token)['sub']);
        }, []);
    
        useEffect(() => {
            if (!user || !class_id) { return; }
            
            fetchAssignments(class_id, user.id)
                .then((res) => {
                    console.log(res);
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
                })
                .finally(() => {
                    setLoading(false);
                }
            );
        }, [class_id, user]);

    return (
        <div>
            <h1 className="text-2xl font-bold">{className} Grades</h1>
            <Card>
                <Table>
                    <TableCaption>
                        Your grades for {className}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left w-[200px]">Assignment</TableHead>
                            <TableHead className="text-left w-[80px]">Due</TableHead>
                            <TableHead className="text-left w-[60px]">Score</TableHead>
                            <TableHead className="text-left w-[60px]">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow className="py-8" key={assignment.id}>
                                <TableCell className="text-left">{assignment.title}</TableCell>
                                <TableCell className="text-left">{format(new Date(assignment.due_date), "MMM dd, yyyy")}</TableCell>
                                <TableCell className="text-left">{assignment.score ? assignment.score.grade : assignment.score ? assignment.score.grade : 0}</TableCell>
                                <TableCell className="text-left">{assignment.total_points}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="text-left font-bold">Overall Score</TableCell>
                            <TableCell className="text-left"></TableCell>
                            <TableCell className="text-left">{overallScore ? overallScore.toFixed(0) : 0}/{overallTotal}</TableCell>
                            <TableCell className="text-left">{overallPercent}%({grade})</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}