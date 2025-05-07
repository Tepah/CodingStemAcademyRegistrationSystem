import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/app/layout";
import { jwtDecode } from "jwt-decode";

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
    }, []);


    return (
        <Layout>
            <div>

            </div>
        </Layout>
    )
}