import React, {useEffect, useState} from 'react';
import { Layout } from "@/app/layout";
import { useRouter } from 'next/router';
import { Skeleton } from '@/components/ui/skeleton';
import { jwtDecode } from 'jwt-decode';
import AllStudentGradesTable from "@/components/tables/grades/AllStudentGrades";



export default function AllStudentGrades() {
    const router = useRouter();
    const { student_id } = router.query;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Student Grades', href: `/admin/users/students/${student_id}` }
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUser(decodedToken['sub']);
        setLoading(false);
    }, []);


    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container max-w-[900px] mx-auto flex-1 flex flex-col gap-4 p-8">

            {loading ? (
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                </div>
            ) : (
                <AllStudentGradesTable student_id={student_id} />
            )}
            </div>
        </Layout>
    )
}