import React, {useEffect} from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/config";
import {DataTable} from "@/components/tables/classes/teacher/data-table";
import {columns} from "@/components/tables/classes/teacher/columns";
import {Label} from "@/components/ui/label";

export default function teacherClasses() {
    const router = useRouter()
    const [classes, setClasses] = React.useState([]);
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const teacherId = router.query.teacher_id;
    const [teacher, setTeacher] = React.useState(null);
    
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
    }, []);
    
    useEffect(() => {
        const fetchStudentCount = async (classesData) => {
            const updatedClasses = await Promise.all(
                classesData.map(async (classItem) => {
                    try {
                        const response = await axios.get(`${config.backendUrl}/student-count`, {
                            params: {
                                class_id: classItem['id']
                            }
                        });
                        classItem['student_count'] = response.data['student_count'];
                    } catch (error) {
                        console.error("Error fetching student count:", error);
                        classItem['student_count'] = 0; // Fallback value if the request fails
                    }
                    return classItem;
                })
            );
            return updatedClasses;
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
            axios.get(`${config.backendUrl}/all-classes-by-teacher`, {
                params: {
                    teacher_id: teacherId
                }
            })
                .then((response) => {
                console.log(response.data);
                let classData = response.data['classes'];
                fetchStudentCount(classData)
                .then((data) => {
                    console.log("Fetched student count:", data);
                    setClasses(data);
                })
                .catch((error) => {
                    console.error("Error fetching student count:", error);
                });
                })
                .catch((error) => {
                    console.error("Error fetching classes:", error);
                });
        }
        if (user['role'] === 'Admin' && teacherId) {
            console.log("Fetching classes");
            fetchClasses().then(() => console.log("Fetched classes"));
        }
        console.log(teacher);
        if (!teacher && teacherId) {
            axios.get(`${config.backendUrl}/user`, {
                params: {
                    id: teacherId
                }
            })
                .then((response) => {
                    console.log(response.data);
                    setTeacher(response.data['user']);
                })
                .catch((error) => {
                    console.error("Error fetching teacher:", error);
                });
        }
    }, [user, teacherId])

    useEffect(() => {
        if (classes && teacher){
            setLoading(false);
        }
    }, [classes, teacher])
    
    return (
        <Layout>
            <div className="container mx-auto p-12">
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-3xl font-bold">Loading...</h1>
                </div>
            ) : user['role'] === 'Admin' ? (
                <div>
                    <Label className="flex flex-row">
                        <h1 className="text-3xl font-bold">{teacher['first_name']} {teacher['last_name']}'s Classes</h1>
                        <p className="text-gray-500">Teacher</p>
                    </Label>
                    <DataTable columns={columns} data={classes} teacherId={teacherId} />
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