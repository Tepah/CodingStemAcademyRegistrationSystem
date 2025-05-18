import React, { useState, useEffect } from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import { DataTable } from '@/components/tables/assignments/student/data-table';
import { columns } from '@/components/tables/assignments/student/columns';
import { getAssignmentsForStudent } from '@/components/api/api';
import { getAssignmentsForTeacher } from '@/components/api/api';


export default function Assignments() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);

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
    <Layout>
      <div className="container max-w-[900px] mx-auto p-8 flex flex-col flex-1 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Assignments</h1>
        <DataTable data={assignments} columns={columns} />
      </div>
    </Layout>
  )
}