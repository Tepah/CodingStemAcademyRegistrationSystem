import React, {useEffect} from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/config";
import {DataTable} from "@/components/tables/payments/data-table";
import {columns} from "@/components/tables/payments/columns";
import {Label} from "@/components/ui/label";

export default function Donations() {
    const router = useRouter()
    const [payments, setPayments] = React.useState([]);
    const [user, setUser] = React.useState({});
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        router.push('/').then(() => {
            console.log('Redirected to home page')
        })
        } else {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken['sub']);
        console.log("Decoded token:", decodedToken);
        }
    }, []);
    
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/payments`);
                const payments = res.data['payments'];
                console.log("Fetched payments:", payments);
                return payments;
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        }

        const fetchStudents = async (paymentsData) => {
            try {
                const updatedPayments = await Promise.all(
                    paymentsData.map(async (payment) => {
                    const studentId = payment['student_id'];
                        try {
                            const response = await axios.get(`${config.backendUrl}/user`, {
                                params: {
                                    id: studentId
                                }
                            });
                            const student = response.data['user'];
                            payment['first_name'] = student['first_name'];
                            payment['last_name'] = student['last_name'];
                            
                        } catch (error) {
                            console.error("Error fetching student:", error);
                        }
                        return payment;
                    }));
                return updatedPayments;
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        if (user['role'] === 'Admin') {
            fetchPayments()
            .then((res) => {
                const paymentsData = res;
                fetchStudents(paymentsData)
                    .then((studentsData) => {
                        setPayments(studentsData);
                        console.log("Payments with students data:", studentsData);
                    }).catch((error) => {
                        console.error("Error fetching students data:", error);
                    });
            }
            ).catch((error) => {
                console.error("Error fetching payments:", error);
            });
        }
    }, [user])
    
    return (
        <Layout>
            <div className="container p-12">
              { user['role'] === 'Admin' ? (
                <div>
                    <Label className="flex flex-row">
                        <h1 className="text-3xl font-bold">Manage Donations</h1>
                    </Label>
                    { payments && (
                        <DataTable columns={columns} data={payments} />
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">You are not authorized to view this page</h1>
                </div>
            )}
            </div>
        </Layout>
    )
}