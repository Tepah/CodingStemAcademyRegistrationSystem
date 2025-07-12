import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { jwtDecode } from "jwt-decode";
import { Separator } from '@/components/ui/separator';
import { getAllClassesForStudent, getSemester, getUser } from '@/components/api/api';
import ClassCard from '@/components/dashboard/class-cards';
import { getAllClassesForTeacher } from '@/components/api/api';


export default function Classes() {
    const [user, setUser] = useState(null);
    const [classes, setClasses] = useState([]);
    const crumbs = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Classes', href: '/classes' },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        setUser(user['sub']);
    }, []);

    useEffect(() => {
        if (user && user['role'] === 'Student') {
            getAllClassesForStudent(user['id'])
                .then((classes) => {
                    Promise.all(
                        classes.map(async (classData) => {
                            try {
                                const semester = await getSemester(classData.semester_id);
                                const teacher = await getUser(classData.teacher_id);
                                return { ...classData, semester: semester.name, teacher: teacher };
                            } catch (error) {
                                console.error("Error fetching semester:", error);
                                return classData;
                            }
                        })
                    ).then((updatedClasses) => {
                        const tempClasses = [];
                        for (const cur of updatedClasses) {
                            if (tempClasses.length < 1 || tempClasses.at(-1).at(-1)['semester'] !== cur['semester']) {
                                tempClasses.push([cur]);
                            } else if (tempClasses.at(-1).at(-1)['semester'] === cur['semester']) {
                                tempClasses.at(-1).push(cur);
                            }
                        }
                        console.log("Updated Classes: ", tempClasses);
                        setClasses(tempClasses);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching classes:", error);
                });
        } else if (user && user['role'] === 'Teacher') {
            getAllClassesForTeacher(user['id'])
                .then((classes) => {
                    Promise.all(
                        classes.map(async (classData) => {
                            try {
                                const semester = await getSemester(classData.semester_id);
                                const teacher = await getUser(classData.teacher_id);
                                return { ...classData, semester: semester.name, teacher: teacher };
                            } catch (error) {
                                console.error("Error fetching semester:", error);
                                return classData;
                            }
                        })
                    ).then((updatedClasses) => {
                        const tempClasses = [];
                        for (const cur of updatedClasses) {
                            if (tempClasses.length < 1 || tempClasses.at(-1).at(-1)['semester'] !== cur['semester']) {
                                tempClasses.push([cur]);
                            } else if (tempClasses.at(-1).at(-1)['semester'] === cur['semester']) {
                                tempClasses.at(-1).push(cur);
                            }
                        }
                        console.log("Updated Classes: ", tempClasses);
                        setClasses(tempClasses);
                    });
                }).then((error) => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [user]);

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container flex flex-col flex-1 space-y-8 p-8">
                <h1 className="text-2xl font-bold mb-4">Classes</h1>
                {classes.map((semester, index) => (
                    <div key={index} className="flex flex-1 flex-col gap-4 py-4">
                        <div className="flex flex-row">
                            <h2 className="text-xl font-bold mb-4">{semester[0].semester}</h2>
                            <div className="w-full flex flex-1 flex-col pt-2 pl-2">
                                <Separator />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8">
                            {semester.map((classData) => (
                                <ClassCard key={classData.id} classData={classData} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}