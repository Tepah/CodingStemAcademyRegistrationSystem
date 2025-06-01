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
import { Button } from '@/components/ui/button';
import EditUserSheet from '@/components/sheets/edit-user-sheet';
import { SheetTrigger } from '@/components/ui/sheet';
import formatDate from '@/components/helpers/date';

export default function TeacherPage() {
    const [user, setUser] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { teacher_id } = router.query;
    const crumbs = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Teachers', href: '/admin/users/teachers' },
        { name: 'Teacher Details', href: `/admin/teacher/${teacher_id}` }
    ]

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
        if (!teacher_id) return;
        const fetchTeacher = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/user`, { params: { id: teacher_id } });
                console.log("Fetched teacher:", res.data);
                setTeacher(res.data["user"]);
                return res.data["user"];
            } catch (error) {
                console.error('Error fetching teacher:', error);
            }
        }
        fetchTeacher().finally((res) => {
            setLoading(false);
        })
    }, [teacher_id]);

    if (loading) {
        return (
            <Layout breadcrumbs={crumbs}>
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
                    <h1 className="text-2xl font-bold">{teacher.first_name} {teacher.last_name}</h1>
                    <EditUserSheet user={teacher}>
                        <SheetTrigger asChild>
                            <Button variant="default" size="sm">
                                Edit Teacher
                            </Button>
                        </SheetTrigger>
                    </EditUserSheet>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Teacher Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <p>Teacher ID: {teacher_id}</p>
                            <p>Name: {teacher.first_name} {teacher.last_name}</p>
                            <p>Gender: {teacher.gender}</p>
                            <p>Date of Birth: {teacher.birth_date ? formatDate(teacher.birth_date) : "Not provided"}</p>
                            <p>Email: {teacher.email}</p>
                            <p>Phone: {teacher.phone}</p>
                            <p>Address: {teacher.address}</p>
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-4 mt-4">
                            <Label className="text-lg font-semibold">Experience</Label>
                            <p>{teacher.experience ? teacher.experience : "No experience listed"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}