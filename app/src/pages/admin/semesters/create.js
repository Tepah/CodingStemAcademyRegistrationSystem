import React, { useState } from 'react';
import {SemesterForm} from '@/components/forms/semester/form';
import { Layout } from '@/app/layout';

export default function CreateSemester() {
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Semesters', href: '/admin/semesters' },
        { name: 'Create Semester', href: '/admin/semesters/create' }
    ]);
    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container mx-auto p-8 w-[500px] flex flex-col space-y-8">
                <h1 className="text-xl font-semibold">Create Semester</h1>
                <SemesterForm />
            </div>
        </Layout>
    )
}
