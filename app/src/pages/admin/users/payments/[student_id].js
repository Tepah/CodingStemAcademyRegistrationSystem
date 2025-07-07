import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "@/components/tables/payments/data-table";
import { columns } from "@/components/tables/payments/columns-ex";
import { Layout } from "@/components/layout/Layout";
import { getUser, getPaymentsForStudent } from "@/components/api/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Payments() {
    const router = useRouter();
    const { student_id } = router.query;
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState({});
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Student', href: `/admin/users/donations/${student_id}` },
        { name: 'Student Donations', href: `/admin/users/donations/${student_id}` }
    ]);

    useEffect(() => {
        if (student_id) {
            getUser(student_id).then((data) => { 
                setStudent(data);
                setCrumbs((prev) => {
                    const updatedCrumbs = [...prev];
                    updatedCrumbs[3] = { name: `${data['first_name']} ${data['last_name']}`, href: `/admin/users/student/${student_id}` };
                    updatedCrumbs[4] = { name: 'Student Donations', href: `/admin/users/donations/${student_id}` };
                    return updatedCrumbs;
                })
             });
            getPaymentsForStudent(student_id).then((data) => { setPayments(data); });
        }
    }, [student_id]);

    if (!payments || !student) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="flex flex-col container mx-auto max-w-[1000px] p-8">
                <h1 className="text-2xl font-bold">{student['first_name']} {student['last_name']} Donations</h1>
                <DataTable data={payments} columns={columns}>
                    <Button asChild variant="default" size="sm">
                        <Link href={`${student_id}/add`}>
                            Add Donation
                        </Link>
                    </Button>
                </DataTable>
            </div>
        </Layout>
    );
}