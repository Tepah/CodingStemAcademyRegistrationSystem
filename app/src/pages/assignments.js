import React, { useState, useEffect } from 'react';
import {Layout} from "@/components/layout/Layout";
import {jwtDecode} from "jwt-decode";
import { DataTable } from '@/components/tables/assignments/student/data-table';
import { columns } from '@/components/tables/assignments/student/columns';
import { getAssignmentsForStudent } from '@/components/api/api';
import { getAssignmentsForTeacher } from '@/components/api/api';
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Assignments() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Assignments', href: '/assignments' },
  ];

  // Get user from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => {console.log("Returning logged out user to main")})
    }
    const user = jwtDecode(token);
    setUser(user['sub']);
  }, []);

  useEffect(() => {
    if (user && user['role'] === 'Student') {
      getAssignmentsForStudent(user['id'])
        .then((data) => {
          setAssignments(data);
        })
        .catch((error) => {
          console.error("Error fetching assignments:", error);
        });
    } else if (user && user['role'] === 'Teacher') {
      getAssignmentsForTeacher(user['id'])
        .then((data) => {
          setAssignments(data);
        })
        .catch((error) => {
          console.error("Error fetching assignments:", error);
        });
    }
  }, [user]);


  return (
    <Layout breadcrumbs={crumbs}>
      <div className="container max-w-[900px] mx-auto p-8 flex flex-col flex-1 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>
          {user && user.role === "Teacher" && (
            <Link href={`/assignments/create`}>
              <Button variant="default">Make Assignment</Button>
            </Link>
          )}
        </div>
        <DataTable data={assignments} columns={columns} />
      </div>
    </Layout>
  )
}