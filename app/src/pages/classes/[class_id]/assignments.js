import { Layout } from "@/app/layout";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import config from "@/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";

export default function Assignments() {
  const router = useRouter();
  const { class_id } = router.query;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);


  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/').then(() => {console.log("Returning logged out user to main")})
      }
      const user = jwtDecode(token);
      setUser(user['sub']);
    }, []);


  useEffect(() => {
    if (class_id) {
      const fetchAssignments = async () => {
        try {
          const response = await axios.get(`${config.backendUrl}/assignments`, {
            params: { class_id },
          });
          setAssignments(response.data.assignments);
        } catch (err) {
          console.error("Error fetching assignments:", err);
          setError("Failed to load assignments.");
        } finally {
          setLoading(false);
        }
      };

      fetchAssignments();
    }
  }, [class_id]);

  if (loading) {
    return (
      <Layout title={"Assignments"}>
        <div className="flex items-center justify-center h-screen">
          <p>Loading assignments...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Assignments"}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={"Assignments"}>
      <div className="container max-w-[900px] mx-auto flex flex-1 flex-col gap-4 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>
          {user && user.role === "Teacher" && (
            <Link href={`/classes/${class_id}/assignments/create`}>
              <Button variant="default">Make Assignment</Button>
            </Link>
          )}
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table className="">
            <TableCaption>All Assignments for this class.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-[350px]">Title</TableHead>
                <TableHead className="text-right">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-100" 
                    key={assignment.id}
                    onClick={() => router.push(`/classes/${class_id}/assignments/${assignment.id}`)}>
                      <TableCell>{assignment.id}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell className="text-right">{new Date(assignment.due_date).toLocaleDateString("en-US", { timeZone: "UTC" })}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    This class has no assignments.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}