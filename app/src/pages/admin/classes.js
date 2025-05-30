import React, {useEffect} from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/config";
import {DataTable} from "@/components/tables/classes/data-table";
import {columns} from "@/components/tables/classes/columns";
import {Label} from "@/components/ui/label";

export default function Classes() {
    const router = useRouter()
    const [classes, setClasses] = React.useState([]);
    const [semester, setSemester] = React.useState([]);
    const [user, setUser] = React.useState({});
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUser(decodedToken['sub']);
        console.log("Decoded token:", decodedToken);
        axios.get(`${config.backendUrl}/current-semester`)
        .then((response) => {
            console.log("Current semester:", response.data);
            setSemester(response.data['semester']);
        })
        .catch((error) => {
            console.error("Error fetching current semester:", error);
        });
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

        const fetchClasses = async () => {
            axios.get(`${config.backendUrl}/classes`)
                .then((response) => {
                console.log(response.data);
                let classData = response.data['classes'];
                fetchTeachers(classData).then((teachers) => {
                    const updatedClasses = classData.map((classItem) => {
                      if (!classItem['teacher_id']) {
                          return {
                              ...classItem,
                              teacher_name: 'N/A'
                          };
                      }
                        const teacher = teachers.find((teacher) => teacher && teacher.id === classItem['teacher_id']);
                        return {
                            ...classItem,
                            teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'N/A'
                        };
                    });

                    console.log("Updated classes:", updatedClasses);

                    fetchSemesters(updatedClasses).then((semesters) => {
                        const semUpdatedClasses = updatedClasses.map((classItem) => {
                            const semester = semesters.find((semester) => semester.id === classItem['semester_id']);
                            return {
                                ...classItem,
                                semester: semester ? semester.name : 'N/A'
                            };
                        });
                        fetchStudentCount(semUpdatedClasses)
                            .then((data) => {
                                console.log("Fetched student count:", data);
                                setClasses(data);
                            })
                            .catch((error) => {
                                console.error("Error fetching student count:", error);
                            });
                        }
                    );
                })
                .catch((error) => {
                console.error("Error fetching classes:", error);
                });
            })
        }
        if (user['role'] === 'Admin') {
            console.log("Fetching classes");
            fetchClasses().then(() => console.log("Fetched classes"));
        }
    }, [user])
    
    return (
        <Layout>
            <div className="container max-w-[1000px] flex flex-row flex-1 mx-auto p-12">
              { user['role'] === 'Admin' ? (
                <div>
                    <Label className="flex flex-row">
                        <h1 className="text-3xl font-bold">Manage Classes</h1>
                    </Label>
                    <DataTable columns={columns} data={classes} semester={semester.name} />
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