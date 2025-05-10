import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Layout } from "@/app/layout";
import axios from 'axios';
import config from '@/config';
import { useRouter } from 'next/router';
import { GradesDataTable } from '../tables/grades/OverallView/data-table';
import { columns } from '../tables/grades/OverallView/columns';
import { Skeleton } from '../ui/skeleton';

export default function TeacherGrade() {
    const [classData, setClassData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [processedStudents, setProcessedStudents] = useState([]); // New state for final results
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { class_id } = router.query;

    useEffect(() => {
        if (!class_id) return;

        setLoading(true);

        Promise.all([
            axios.get(`${config.backendUrl}/assignments`, { params: { class_id: class_id } })
                .then((res) => {
                    setAssignments(res.data['assignments']);
                })
                .catch((error) => {
                    console.error('Error fetching assignments:', error);
                }),
            axios.get(`${config.backendUrl}/get-students-by-class`, { params: { class_id: class_id } })
                .then((res) => {
                    res.data['students'].forEach((student) => {
                        student['assignments'] = [];
                    });
                    setStudents(res.data['students']);
                })
                .catch((error) => {
                    console.error('Error fetching students:', error);
                }),
            axios.get(`${config.backendUrl}/class/${class_id}`)
                .then((res) => {
                    setClassData(res.data['class']);
                })
                .catch((error) => {
                    console.error('Error fetching class data:', error);
                }),
        ])
            .finally(() => {
                setLoading(false);
            });
    }, [class_id]);

    useEffect(() => {
        if (!assignments.length || !students.length) return;

        const fetchGrades = async () => {
            try {
                const updatedStudents = await Promise.all(
                    students.map(async (student) => {
                        const updatedAssignments = await Promise.all(
                            assignments.map(async (assignment) => {
                                try {
                                    const res = await axios.get(
                                        `${config.backendUrl}/scores/${assignment.id}/student/${student.id}`
                                    );
                                    return { ...assignment, scores: res.data['score'] };
                                } catch (error) {
                                    console.error('Error fetching grade:', error);
                                    return { ...assignment, scores: null };
                                }
                            })
                        );
                        const res = await axios.get(`${config.backendUrl}/total`, {params: {student_id: student.id, class_id: class_id}});
                        const total = res.data['total'];
                        return { ...student, assignments: updatedAssignments, total: total };
                    })
                );
                setProcessedStudents(updatedStudents); // Update the processed students
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, [assignments, students, class_id]); // Only runs when assignments or students are initially loaded

    if (loading) {
        return (
            <div className="container mx-auto flex flex-col p-4 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto flex flex-col p-4 gap-4">
            <h1 className="text-4xl font-bold mb-4">Grades for {classData?.class_name}</h1>
            <GradesDataTable data={processedStudents} columns={columns(assignments)} />
        </div>
    );
}