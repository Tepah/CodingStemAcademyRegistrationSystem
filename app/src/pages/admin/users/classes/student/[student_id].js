import React, {useEffect} from 'react';
import {Layout} from "@/components/layout/Layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/config";
import {DataTable} from "@/components/tables/classes/student/data-table";
import {createColumns} from "@/components/tables/classes/student/columns";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function StudentClasses() {
    const router = useRouter()
    const [classes, setClasses] = React.useState([]);
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const studentId = router.query.student_id;
    const [student, setStudent] = React.useState(null);
    const [crumbs, setCrumbs] = React.useState([
                { name: 'Home', href: '/dashboard' },
                { name: 'Users', href: '/admin/users' },
                { name: 'Students', href: '/admin/users/students' },
                { name: `Student Details`, href: `/admin/users/student/${studentId}` },
                { name: `Classes`, href: `/admin/users/classes/student/${studentId}` }
    ]);
    const columns = createColumns(() => router.refresh());

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        router.push('/').then(() => {
            console.log('Redirected to home page')
        })
        } else {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken['sub']);
        console.log("Decoded token:", decodedToken);
        }
    }, [router]);
    
    useEffect(() => {
        const fetchTeachers = async (classesData) => {
            const teacherIds = classesData.map((classItem) => classItem['teacher_id']);
            const uniqueTeacherIds = [...new Set(teacherIds)];
            const teachers = await Promise.all(uniqueTeacherIds.map(async (teacherId) => {
                const response = await axios.get(`${config.backendUrl}/user`, {
                    params: {
                        id: teacherId
                    }
                });
                return response.data['user'];
            }));
            console.log("Fetched teachers:", teachers);
            return teachers;
        }

        const fetchSemesters = async (classesData) => {
            const semesterIds = classesData.map((classItem) => classItem['semester_id']);
            const uniqueSemesterIds = [...new Set(semesterIds)];
            const semesters = await Promise.all(uniqueSemesterIds.map(async (semesterId) => {
                const response = await axios.get(`${config.backendUrl}/semester`, {
                    params: {
                        id: semesterId
                    }
                });
                return response.data['semester'];
            }));
            console.log("Fetched semesters:", semesters);
            return semesters;
        }

        const fetchClasses = async () => {
            axios.get(`${config.backendUrl}/all-classes-by-student`, {
                params: {
                    student_id: studentId
                }
            })
                .then((response) => {
                console.log(response.data);
                let classData = response.data['classes'];
                fetchTeachers(classData).then((teachers) => {
                    console.log("Fetched teachers:", teachers);
                    const updatedClasses = classData.map((classItem) => {
                        const teacher = teachers.find((teacher) => teacher.id === classItem['teacher_id']);
                        return {
                            ...classItem,
                            teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'N/A'
                        };
                    });

                    console.log("Updated classes:", updatedClasses);
                    setClasses(updatedClasses);
                })
                .catch((error) => {
                console.error("Error fetching classes:", error);
                });
            })
        }
        if (user['role'] === 'Admin' && studentId) {
            console.log("Fetching classes");
            fetchClasses().then(() => console.log("Fetched classes"));
        }
        console.log(student);
        if (!student && studentId) {
            axios.get(`${config.backendUrl}/user`, {
                params: {
                    id: studentId
                }
            })
                .then((response) => {
                    console.log(response.data);
                    setStudent(response.data['user']);
                })
                .catch((error) => {
                    console.error("Error fetching student:", error);
                });
        }
    }, [user, studentId, student])

    useEffect(() => {
        if (classes && student){
            const updatedCrumbs = [
                { name: 'Home', href: '/dashboard' },
                { name: 'Users', href: '/admin/users' },
                { name: 'Students', href: '/admin/users/students' },
                { name: `${student['first_name']} ${student['last_name']}`, href: `/admin/users/student/${studentId}` },
                { name: `Classes`, href: `/admin/users/classes/student/${studentId}` }
            ];
            setCrumbs(updatedCrumbs);
            console.log("Updated breadcrumbs:", updatedCrumbs);
            setLoading(false);
        }
    }, [classes, student])
    
    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container mx-auto max-w-[1000px] p-8">
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-3xl font-bold">Loading...</h1>
                </div>
            ) : user['role'] === 'Admin' ? (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label className="flex flex-row">
                            <h1 className="text-3xl font-bold">{student['first_name']} {student['last_name']}&apos;s classes</h1>
                            <p>Student</p>
                        </Label>
                        <Button variant="default" onClick={() => router.push(`${studentId}/register-classes`)}>
                            Register Classes
                        </Button>
                    </div>
                    <DataTable columns={columns} data={classes} />
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">You are not authorized to view this page</h1>
                </div>
            )}
            </div>
        </Layout>
    )
}