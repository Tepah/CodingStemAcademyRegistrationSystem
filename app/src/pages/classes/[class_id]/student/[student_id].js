import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/layout/Layout";
import { jwtDecode } from "jwt-decode";
import SingleGradeTable from "@/components/tables/grades/singleGradeTable";
import axios from "axios";
import config from "@/config";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import AiAllFeedback from "@/components/dialogs/AiAllFeedback";

export default function StudentClassDetails() {
    const [user, setUser] = useState({});
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [className, setClassName] = useState(null);

    const router = useRouter();
    const { class_id, student_id } = router.query;
    const [crumbs, setCrumbs] = useState([
        { name: "Home", href: "/dashboard" },
        { name: "Classes", href: "/classes" },
        { name: "Class", href: `/classes/${class_id}` },
        { name: "Grades", href: `/classes/${class_id}/grades` }
    ]);


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
        if (!class_id || !student_id) {
            console.error("Class ID or Student ID is missing");
            return;
        }
        Promise.all([
            axios.get(`${config.backendUrl}/class`, { params: { id: class_id } }),
            axios.get(`${config.backendUrl}/user`, { params: { id: student_id } })
        ])
            .then(([classRes, studentRes]) => {
                setClassName(classRes.data.name);
                setStudent(studentRes.data.user);
                console.log("Fetched class:", classRes.data.class);
                console.log("Fetched student:", studentRes.data.user);
                setCrumbs((prevCrumbs) => {
                    const newCrumbs = [...prevCrumbs];
                    if (user['role'] === "Admin") {
                        newCrumbs[1] = { name: "Classes", href: "/admin/classes" };
                    }
                    newCrumbs[2] = { name: classRes.data.class.class_name, href: `/classes/${class_id}` };
                    newCrumbs[3] = { name: `${studentRes.data.user.first_name} ${studentRes.data.user.last_name}'s Grades`, href: `/classes/${class_id}/grades/${student_id}` };
                    return newCrumbs;
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, [router, class_id, student_id]);

    if (user.role !== "Teacher" || user.role !== "Admin") {
        <Layout breadcrumbs={crumbs}>
            <div className="container mx-auto flex flex-col p-4 gap-4">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        </Layout>
    }
    if (loading) {
        return (
            <Layout breadcrumbs={crumbs}>
                <div className="container mx-auto flex flex-col p-4 gap-4">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-200 w-full mb-4" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={crumbs}>
            <div className="container max-w-[900px] mx-auto flex flex-col p-4 gap-4">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold">{user.id !== student_id && (`${student.first_name} ${student.last_name}`)} {className} Grades</h1>
                    <AiAllFeedback class_id={class_id} student_id={student_id}>
                        <Button size="sm" variant="default">
                            <Brain className="mr-2 h-4 w-4" />
                            Generate Feedback
                        </Button>
                    </AiAllFeedback>
                </div>
                <SingleGradeTable class_id={class_id} student_id={student_id} setLoading={setLoading} />
            </div>
        </Layout>
    )
}