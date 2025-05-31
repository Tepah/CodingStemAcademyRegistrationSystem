import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Layout } from "@/app/layout";
import StudentGrade from '@/components/grades/StudentGrade';
import TeacherGrade from "@/components/grades/TeacherGrade";


export default function GradePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(jwtDecode(token)['sub']);
        setLoading(false);
    }, []);
    

    return (
        <Layout>
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