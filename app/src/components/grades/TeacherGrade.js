import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Layout } from "@/app/layout";


export default function TeacherGrade() {
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(jwtDecode(token)['sub']);
    }, []);
    

    return (
        <div className="container mx-auto flex flex-col p-4 gap-4">

        </div>
    );
}