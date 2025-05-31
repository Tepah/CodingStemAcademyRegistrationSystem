import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Layout } from "@/app/layout";
import config from "@/config";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/tables/students/columns";
import { DataTable } from "@/components/tables/students/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ClassDetails() {
  const router = useRouter();
  const { class_id } = router.query;

  const [classDetails, setClassDetails] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

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
  }, [router])

  useEffect(() => {
    const fetchTeacher = async (teacherId) => {
      try {
        const response = await axios.get(`${config.backendUrl}/user`, {
          params: { id: teacherId },
        });
        return response.data.user;
      } catch (err) {
        console.error("Error fetching teacher:", err);
        return null;
      }
    }

    const fetchSemester = async (semesterId) => {
      try {
        const response = await axios.get(`${config.backendUrl}/semester`, {
          params: { id: semesterId },
        });
        console.log("Fetched semester:", response.data.semester);
        return response.data.semester;
      } catch (err) {
        console.error("Error fetching semester:", err);
        return null;
      }
    }

    const fetchStudents = async (classId) => {
      try {
        const response = await axios.get(`${config.backendUrl}/get-students-by-class`, {
          params: { class_id: classId },
        })
        console.log("Fetched students:", response.data.students);

        const finalStudents = response.data.students.map((student) => ({
          ...student,
          class_id: classId,
        }));

        return finalStudents;
      } catch (err) {
        console.error("Error fetching students:", err);
        return null;
      }
    }

    if (class_id) {
      const fetchClassDetails = async () => {
        try {
          const response = await axios.get(`${config.backendUrl}/class/${class_id}`);
          fetchTeacher(response.data.class.teacher_id)
            .then((teacher) => {
              const teacherName = teacher ? `${teacher.first_name} ${teacher.last_name}` : "N/A";
              fetchSemester(response.data.class.semester_id).then((semester) => {
                setClassDetails({
                  ...response.data.class,
                  teacher_name: teacherName,
                  semester_name: semester ? semester.name : "N/A",
                });
              });
            });
        } catch (err) {
          console.error("Error fetching class details:", err);
          setError("Failed to load class details.");
        }
      };

      fetchClassDetails();
      fetchStudents(class_id)
        .then((students) => {
          setStudents(students);
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
        });
    }
  }, [class_id]);

  useEffect(() => {
    if (students && classDetails) {
      setLoading(false);
    }
  }, [students, classDetails])


  return (
    <Layout>
      {loading ? (
        <div className="container max-w-[1400px] mx-auto flex flex-col p-8 space-y-8">
          <Skeleton className="w-full h-[700px] rounded-xl" />
          <Skeleton className="w-[400px] h-[50px] rounded-xl" />
        </div>
      )
        : user.role !== "Admin" && user.role !== "Teacher" ? (
          <div className="container mx-auto flex justify-center ">
            <h1 className="text-3xl font-bold">Not authorized to view this page</h1>
          </div>
        ) : (
          <div className="container max-w-[1000px] flex flex-1 flex-col mx-auto space-y-8 p-8">
            <h1 className="text-3xl font-bold mb-6">Class Details</h1>
            <Card className="">
              <CardHeader className="w-1/2">
                <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">{classDetails.class_name}</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Subject:</Label>
                    <p className="text-xl font-semibold tabular-nums">{classDetails.subject}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Time:</Label>
                    <p className="text-xl font-semibold tabular-nums">{classDetails.day} from {classDetails.start_time} to {classDetails.end_time}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Teacher:</Label>
                    <p className="text-xl font-semibold tabular-nums">{classDetails.teacher_name}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Semester:</Label>
                    <p className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{classDetails.semester_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <CardTitle>Students</CardTitle>
                <Button size="sm" variant="default" onClick={() => router.push(`/classes/${class_id}/grades`)}>Grades Overview</Button>
              </div>
                
                <Separator />
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={students} />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Total Students: {students.length}</p>
              </CardFooter>
            </Card>
          </div>
        )}
    </Layout>
  );
}