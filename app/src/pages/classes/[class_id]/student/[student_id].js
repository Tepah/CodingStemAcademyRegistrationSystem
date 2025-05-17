import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/app/layout";
import { jwtDecode } from "jwt-decode";
import SingleGradeTable from "@/components/tables/grades/singleGradeTable";

export default function StudentClassDetails() {
    const [user, setUser] = useState({});
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    
    const router = useRouter();
    const { class_id, student_id } = router.query;

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        router.push("/").then(() => {
            console.log("Redirected to home page");
        });
        } else {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken["sub"]);
        console.log("Decoded token:", decodedToken);
        }
    }, [router]);

    if (user.role !== "Teacher" || user.role !== "Admin") {
        <Layout>
            <div className="container mx-auto flex flex-col p-4 gap-4">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        </Layout>
    }

    return (
        <Layout>
            <div className="container mx-auto flex flex-col p-4 gap-4">
                <SingleGradeTable class_id={class_id} student_id={student_id} setLoading={setLoading} />
            </div>
        </Layout>
    )
}