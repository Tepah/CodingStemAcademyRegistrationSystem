import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from '@/app/layout';
import axios from 'axios';
import config from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from "@/components/ui/label";
import AllStudentGradesTable from '@/components/tables/grades/AllStudentGrades';
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import EditUserSheet from '@/components/sheets/edit-user-sheet';
import { SheetTrigger } from '@/components/ui/sheet';
import formatDate from '@/components/helpers/date';
import { set } from 'date-fns';

export default function StudentPage() {
    const [user, setUser] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { student_id } = router.query;
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Student Details', href: `/admin/students/${student_id}`}
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("Token not found in local storage");
            window.location.href = "/";
        } else {
            const user = jwtDecode(token);
            console.log(user['sub']);
            setUser(user['sub']);
        }
    }, []);

    useEffect(() => {
        if (!student_id) return;
        const fetchStudent = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/user`, { params: { id: student_id } });
                console.log("Fetched student:", res.data);
                setStudent(res.data["user"]);
                setCrumbs(prevCrumbs => {
                    if (user['role'] === 'Teacher') {
                        const updatedCrumbs = [];
                        updatedCrumbs.push({ name: 'Home', href: '/dashboard' });
                        updatedCrumbs.push({ name: 'Classes', href: '/classes' });

                        return updatedCrumbs;
                    } else {
                        const updatedCrumbs = [...prevCrumbs];
                        updatedCrumbs[3] = { name: `${res.data['user'].first_name} ${res.data['user'].last_name}`, href: `/admin/students/${student_id}` };

                        return updatedCrumbs;
                    }
                });
                return res.data["user"];
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        }
        if (!user) return;
        fetchStudent().finally((res) => {
            setLoading(false);
        })
    }, [student_id, user]);

    if (loading) {
        return (
            <Layout>
                <div className="container max-w-[900px] mx-auto flex-1 flex flex-col gap-4 p-8">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </Layout>
        );
    }

    if (user['role'] !== 'Admin' && user['role'] !== 'Teacher') {
        return (
            <Layout breadcrumbs={crumbs}>
                <div className="container max-w-[900px] mx-auto flex-1 flex flex-col p-8">
                    <Card>
                        <h1 className="text-2xl font-bold">You are not authorized to view this page</h1>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container max-w-[900px] mx-auto flex-1 flex flex-col gap-4 p-8">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold">{student.first_name} {student.last_name}</h1>
                    <EditUserSheet user={student}>
                        <SheetTrigger asChild>
                            <Button variant="default" size="sm">
                                Edit Student
                            </Button>
                        </SheetTrigger>
                    </EditUserSheet>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <p>Student ID: {student_id}</p>
                            <p>Name: {student.first_name} {student.last_name}</p>
                            <p>Gender: {student.gender}</p>
                            <p>Date of Birth: {student.birth_date ? formatDate(student.birth_date) : 'N/A'}</p>
                            <p>Email: {student.email}</p>
                            <p>Phone: {student.phone}</p>
                            <p>Address: {student.address}</p>
                            <p>Grade: {student.grade_level}</p>
                        </div>
                        <Label className="text-lg font-bold my-4">Guardian Information</Label>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <p>Guardian Name: {student.guardian}</p>
                            <p>Guardian Phone: {student.guardian_phone}</p>
                        </div>
                        <Label className="text-lg font-bold my-4">Health Insurance</Label>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <p>Insurance Provider: {student.health_ins}</p>
                            <p>Policy Number: {student.health_ins_num}</p>
                        </div>
                    </CardContent>
                </Card>
                <AllStudentGradesTable student_id={student_id} personal={false} />
            </div>
        </Layout>
    );
}