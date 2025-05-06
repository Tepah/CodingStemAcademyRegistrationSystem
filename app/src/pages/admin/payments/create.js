import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/app/layout";
import { CreatePaymentForm } from "@/components/forms/payment/form";

export default function CreateDonation() {
     

    return (
        <Layout>
            <div className="container p-8 w-[500px]">
                <h1 className="text-2xl font-bold mb-4">Create Donation</h1>
                <CreatePaymentForm />
            </div>
        </Layout>
    )
}