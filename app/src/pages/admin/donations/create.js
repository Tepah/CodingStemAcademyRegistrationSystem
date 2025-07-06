import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/layout/Layout";
import { CreatePaymentForm } from "@/components/forms/donation/form";

export default function CreateDonation() {
    const crumbs = [
        { name: 'Home', href: '/dashboard' },
        { name: 'Donations', href: '/admin/donations' },
        { name: 'Create Donation', href: '/admin/donations/create' }
    ];
     

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container flex flex-col flex-1 mx-auto p-8 max-w-[500px]">
                <h1 className="text-2xl font-bold mb-4">Create Donation</h1>
                <CreatePaymentForm />
            </div>
        </Layout>
    )
}