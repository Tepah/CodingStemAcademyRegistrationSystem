import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Layout } from "@/components/layout/Layout";
import StudentGrade from '@/components/grades/StudentGrade';
import TeacherGrade from "@/components/grades/TeacherGrade";
import { useRouter } from 'next/router';
import axios from 'axios';
import config from "@/config";


export default function GradePage() {
    const router = useRouter();
    const { class_id } = router.query;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Classes', href: '/classes'},
        { name: 'Class', href: `/classes/${class_id}` },
        { name: 'Grades', href: `/classes/${class_id}/grades` }
    ]);

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(jwtDecode(token)['sub']);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (class_id) {
            axios.get(`${config.backendUrl}/class`, {params: { id: class_id }})
            .then(response => {
                const classData = response.data.class;
                setCrumbs(prevCrumbs => {
                    const newCrumbs = [...prevCrumbs];
                    if (jwtDecode(localStorage.getItem('token'))['sub']['role'] === 'Admin') {
                        newCrumbs[1] = { name: 'Classes', href: '/admin/classes' };
                    }
                    newCrumbs[2] = { name: classData['class_name'], href: `/classes/${class_id}` };
                    return newCrumbs;
                });
            })
        }
    }, [class_id])


    return (
        <Layout breadcrumbs={crumbs}>
            {user && user['role'] === 'Student' ? <StudentGrade /> :
            user && (user['role'] === 'Teacher' || user['role'] === 'Admin') ?<TeacherGrade /> : 
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-gray-500">You do not have permission to view this page.</p>
            </div>
            }
        </Layout>
    );
}