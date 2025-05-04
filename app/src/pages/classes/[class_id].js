// ClassPage.tsx
import { useRouter } from 'next/router';
import { Layout } from "@/app/layout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming you saved your Table code as "@/components/ui/table"

const ClassPage = () => {
  const router = useRouter();
  const { class_id } = router.query;
  const [classData, setClassData] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => console.log("Returning logged out user to main"));
      return;
    }
    const decodedUser = jwtDecode(token);
    setUser(decodedUser['sub']);
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/class/${class_id}`);
        setClassData(response.data['class']);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    if (class_id) {
      fetchClassData();
    }
  }, [class_id]);

  return (
    <Layout title={classData.class_name || "Class Details"}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-4xl font-bold mb-4">Class Details</h1>
        <Card className="p-4">
          { <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Course ID</TableCell>
                <TableCell>{class_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Semester ID</TableCell>
                <TableCell>{classData.semester_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>{classData.subject}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Teacher ID</TableCell>
                <TableCell>{classData.teacher_id}</TableCell>
              </TableRow>
            </TableBody>
          </Table> }
        </Card>
      </div>
    </Layout>
  );
};

export default ClassPage;
