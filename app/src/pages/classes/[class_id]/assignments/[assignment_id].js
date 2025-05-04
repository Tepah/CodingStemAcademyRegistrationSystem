import { useRouter } from 'next/router';
import { Layout } from "@/app/layout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClassPage = () => {
  const router = useRouter();
  const { class_id } = router.query; // Corrected from assignment_id to class_id
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => {
        console.log("Returning logged out user to main")
      });
    } else {
      const user = jwtDecode(token);
      setUser(user['sub']);
    }
  }, []);

  useEffect(() => {
    if (!class_id) return; // Wait for router query to be ready
    axios.get(`${config.backendUrl}/assignments`, { params: { class_id: class_id } })
      .then((response) => {
        setAssignments(response.data['assignments']); // Assuming the backend returns an array of assignments
      })
      .catch((error) => {
        console.error("Failed to fetch assignments:", error);
      });
  }, [class_id]);

  return (
    <Layout title="Assignments">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {class_id && (
          <Button onClick={() => router.push(`/classes/${class_id}/assignments/create`)}>
            Make Assignment
          </Button>
        )}
      </div>
      <Card className="p-4">
        <Table>
          <TableCaption>A list of all assignments for this class.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.id}</TableCell>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.description}</TableCell>
                <TableCell className="text-right">{assignment.due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Assignments: {assignments.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </Layout>
  );
};

export default ClassPage;
