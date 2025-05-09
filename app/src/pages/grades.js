import { Layout } from "@/app/layout";
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import AllStudentGradesTable from "@/components/tables/grades/AllStudentGrades";
import { getCurrentSemester } from "@/components/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Grades() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Token found in local storage");
      window.location.href = "/";
    } else {
      const user = jwtDecode(token);
      console.log(user['sub']);
      setUser(user['sub']);
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [user]);

  if (loading) {
    return (
      <Layout title={"Grades"}>
        <Card className="w-[900px] mx-auto flex flex-col p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
        </Card>
      </Layout>
    )
  }


  if (user && user['role'] !== 'Student') {
    return (
      <Layout title={"Grades"}>
        <Card className="w-[900px] mx-auto flex flex-col p-4">
          <h1 className="text-2xl font-bold">You are not authorized to view this page</h1>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout title={"Grades"}>
      <div className="container max-w-[900px] mx-auto flex-1 flex flex-col gap-4 p-8">
        <AllStudentGradesTable student_id={user['id']} personal={true} />
      </div>
    </Layout>
  );
}
