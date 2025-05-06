import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verfiyTeacherInvite } from '@/components/api';
import { Card } from '@/components/ui/card';
import RegisterTeacherForm from '@/components/forms/user/teacher-form';

export default function RegisterTeacher() {
    const router = useRouter();
    const token = router.query.token;
    const [loading, setLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        verfiyTeacherInvite(token)
            .then((response) => {
                console.log(response);
                if (response['status']) {
                    setIsValidToken(true);
                    setEmail(response['email']);
                } else {
                    setIsValidToken(false);
                }
            })
            .catch((error) => {
                console.error("Error verifying teacher invite:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });


    }, [token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!isValidToken) {
        return (
            <div className="flex flex-col container mx-auto my-8 h-screen">
                <h1 className="text-2xl font-bold text-center">Invalid or Expired Token</h1>
                <p className="text-center">Please check the link you received or contact support.</p>
            </div>
        );
    }

    return (

        <div className="flex flex-col items-center justify-center p-8 md:h-screen">
            <h1 className="text-2xl font-bold">Register</h1>
            <Card className="p-8">
                <RegisterTeacherForm email={email} />
            </Card>
        </div>
    )
}