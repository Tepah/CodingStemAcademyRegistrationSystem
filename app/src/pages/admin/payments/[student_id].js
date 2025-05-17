import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "@/components/tables/donations/data-table";
import { columns } from "@/components/tables/donations/columns-ex";
import { Layout } from "@/app/layout";
import { getUser, getPaymentsForStudent } from "@/components/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Payments() {
    const router = useRouter();
    const { student_id } = router.query;
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState({});

    useEffect(() => {
        if (student_id) {
            getUser(student_id).then((data) => { setStudent(data); });
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
        <Layout>
            <div className="flex flex-col container p-8">
                <h1 className="text-2xl font-bold">{student['first_name']} {student['last_name']} Donations</h1>
                <DataTable data={payments} columns={columns}>
                    <Button asChild variant="default" size="sm">
                        <Link href={`/admin/payments/${student_id}/add`}>
                            Add Donation
                        </Link>
                    </Button>
                </DataTable>
            </div>
        </Layout>
    );
}