import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Layout } from "@/app/layout";
import StudentGrade from '@/components/grades/StudentGrade';
import TeacherGrade from "@/components/grades/TeacherGrade";


export default function GradePage() {
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(jwtDecode(token)['sub']);
    }, []);
    

    return (
        <Layout>
            {user && user['role'] === 'Student' ? <StudentGrade /> :
            user && user['role'] === 'Teacher' ? <TeacherGrade /> :
            <p>Page does not exist for this user.</p>
            }
        </Layout>
    );
}