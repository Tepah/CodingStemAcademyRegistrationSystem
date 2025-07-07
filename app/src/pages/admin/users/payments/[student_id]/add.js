import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CreatePaymentForm } from "@/components/forms/payment/form";
import { Layout } from "@/app/layout";
import { getUser } from "@/components/api/api";
import { set } from "date-fns";


export default function AddPayment() {
    const router = useRouter();
    const { student_id } = router.query;
    const [student, setStudent] = useState(null);
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Student', href: `/admin/users/donations/${student_id}` },
        { name: 'Add Donation', href: `/admin/users/donations/${student_id}/add` }
    ]);

    useEffect(() => {
        if (student_id) {
            getUser(student_id).then((e) => {
                setStudent(e)
                setCrumbs((prev) => {
                    const updatedCrumbs = [...prev];
                    updatedCrumbs[3] = { name: `${e['first_name']} ${e['last_name']}`, href: `/admin/users/donations/${student_id}` };
                    updatedCrumbs[4] = { name: 'Add Donation', href: `/admin/users/donations/${student_id}/add` };
                    return updatedCrumbs;
                });
            });
        }
    }, [student_id]);

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container mx-auto max-w-[900px] flex flex-col p-8 gap-4 w-[500px]">
                <h1 className="text-2xl font-bold">Add Payment</h1>
                <CreatePaymentForm student_id={student_id} />
            </div>
        </Layout>
    )
}