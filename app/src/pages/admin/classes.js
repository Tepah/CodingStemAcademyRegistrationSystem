import React, { useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@/config";
import { DataTable } from "@/components/tables/classes/data-table";
import { columns } from "@/components/tables/classes/columns";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton';

export default function Classes() {
    const router = useRouter();
    const [classes, setClasses] = React.useState([]);
    const [semester, setSemester] = React.useState(null);
    const [semestersData, setSemestersData] = React.useState([]);
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const breadcrumbs = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Classes', href: '/admin/classes' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const decodedToken = jwtDecode(token);
        setUser(decodedToken['sub']);
    }, []);

    useEffect(() => {
        if (!router.isReady || !user.role) {
            return;
        }

        const fetchData = async () => {
            setLoading(true); 
            try {
                let targetSemester;
                const response = await axios.get(`${config.backendUrl}/current-semester`);
                targetSemester = response.data['semester'];
                
                setSemester(targetSemester);

                const classesResponse = await axios.get(`${config.backendUrl}/classes`);
                let classesData = classesResponse.data['classes'] || [];

                if (classesData.length === 0) {
                    setClasses([]);
                    setLoading(false);
                    return;
                }

                const teacherIds = [...new Set(classesData.map(c => c.teacher_id).filter(Boolean))];
                const semesterIds = [...new Set(classesData.map(c => c.semester_id).filter(Boolean))];

                const teacherPromises = teacherIds.map(id => axios.get(`${config.backendUrl}/user`, { params: { id } }));
                const semesterPromises = semesterIds.map(id => axios.get(`${config.backendUrl}/semester`, { params: { id } }));
                const studentCountPromises = classesData.map(c => axios.get(`${config.backendUrl}/student-count`, { params: { class_id: c.id } }));

                const [teacherResponses, semesterResponses, studentCountResponses] = await Promise.all([
                    Promise.all(teacherPromises),
                    Promise.all(semesterPromises),
                    Promise.all(studentCountPromises)
                ]);

                const allSemesterRes = await axios.get(`${config.backendUrl}/semesters`);

                setSemestersData(allSemesterRes.data.semesters);

                const teachersMap = new Map(teacherResponses.map(res => [res.data.user.id, res.data.user]));
                const semestersMap = new Map(semesterResponses.map(res => [res.data.semester.id, res.data.semester]));
                const studentCountsMap = new Map(studentCountResponses.map((res, i) => [classesData[i].id, res.data.student_count]));

                const enrichedClasses = classesData.map(classItem => {
                    const teacher = teachersMap.get(classItem.teacher_id);
                    const classSemester = semestersMap.get(classItem.semester_id);
                    return {
                        ...classItem,
                        teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'N/A',
                        student_count: studentCountsMap.get(classItem.id) || 0,
                        semester: classSemester ? classSemester.name : 'N/A',
                    };
                });

                setClasses(enrichedClasses);

            } catch (error) {
                console.error("Failed to fetch class data:", error);
                setClasses([]); 
            } finally {
                setLoading(false); 
            }
        };

        if (user.role === 'Admin') {
            fetchData();
        }

    }, [user, router.isReady, router.query]);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="container max-w-[1000px] flex flex-1 mx-auto p-12">
                {user['role'] === 'Admin' ? (
                    <div>
                        <Label className="flex flex-row">
                            <h1 className="text-3xl font-bold">Manage Classes</h1>
                        </Label>
                        <DataTable columns={columns} data={classes} semester={semester?.id} semestersData={semestersData} />
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">You are not authorized to view this page</h1>
                    </div>
                )}
            </div>
        </Layout>
    );
}