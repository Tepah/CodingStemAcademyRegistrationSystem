import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CreatePaymentForm } from "@/components/forms/payment/form";
import { Layout } from "@/app/layout";
import { getUser } from "@/components/api";
import { set } from "date-fns";


export default function AddPayment() {
    const router = useRouter();
    const { student_id } = router.query;
    const [student, setStudent] = useState(null);

    useEffect(() => {
        if (student_id) {
            getUser(student_id).then((e) => {setStudent(e)});
        }
    }, [student_id]);

    return (
        <Layout>
            <div className="flex flex-col p-8 gap-4 w-[500px]">
                <h1 className="text-2xl font-bold">Add Payment</h1>
                <CreatePaymentForm student_id={student_id} />
            </div>
        </Layout>
    )
}