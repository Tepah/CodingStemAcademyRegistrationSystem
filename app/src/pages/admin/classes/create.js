import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ClassForm } from '@/app/forms/class/form';
import {Layout} from '@/app/layout';
import config from '@/config';


export default function CreateClass() {
    const [semesters, setSemesters] = useState(null);
    const [teachers, setTeachers] = useState(null);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/semesters`);
                console.log('Fetched semesters:', response.data);
                setSemesters(response.data['semesters']);
            } catch (error) {
                console.error('Error fetching semesters:', error);
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/teachers`);
                console.log('Fetched teachers:', response.data);
                setTeachers(response.data['teachers']);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchSemesters();
        fetchTeachers();
    }, [])

    if (!semesters || !teachers) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create Class</h1>
                <ClassForm semesters={semesters} teachers={teachers} />
            </div>
        </Layout>
    )
}