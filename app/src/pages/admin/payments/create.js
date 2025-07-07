import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/layout/Layout";
import { CreatePaymentForm } from "@/components/forms/payment/form";

export default function CreatePayment() {
    const crumbs = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Payments', href: '/admin/payments' },
        { name: 'Create Payment', href: '/admin/payments/create' }
    ];
     

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container flex flex-col flex-1 mx-auto p-8 max-w-[500px]">
                <h1 className="text-2xl font-bold mb-4">Create Payment</h1>
                <CreatePaymentForm />
            </div>
        </Layout>
    )
}