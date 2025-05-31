import React, { useState } from 'react';
import {SemesterForm} from '@/components/forms/semester/form';
import { Layout } from '@/app/layout';

export default function CreateSemester() {
    return (
        <Layout>
            <div className="container mx-auto p-8 w-[500px] flex flex-col space-y-8">
                <h1 className="text-xl font-semibold">Create Semester</h1>
                <SemesterForm />
            </div>
        </Layout>
    )
}
