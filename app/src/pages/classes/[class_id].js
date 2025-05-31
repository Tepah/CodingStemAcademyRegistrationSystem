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
import { columns } from "@/components/tables/students/columns-teach-view";
import { columns as columnsAdmin } from "@/components/tables/students/columns";
import { DataTable } from "@/components/tables/students/data-table";
import Link from "next/link";

export default function ClassDetails() {
  const router = useRouter();
  const { class_id } = router.query;

  const [classDetails, setClassDetails] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [totalGrade, setTotalGrade] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUser(decodedToken["sub"]);
    console.log("Decoded token:", decodedToken);
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

    const fetchFeedback = async (classId, studentId) => {
      try {
        const response = await axios.get(`${config.backendUrl}/feedback-for-class`, {
          params: { class_id: classId, user_id: studentId },
        });
        console.log("Fetched feedback:", response.data.feedback);
        return response.data.feedback;
      } catch (err) {
        console.error("Error fetching feedback:", err);
        return null;
      }
    };

    const fetchTotalGrade = async (classId, studentId) => {
      try {
        const response = await axios.get(`${config.backendUrl}/total`, {
          params: { class_id: classId, student_id: studentId },
        });
        console.log("Fetched total grade:", response.data.total);
        return response.data.total !== null && response.data.total !== undefined ? response.data.total : 0; // Changed here
      } catch (err) {
        console.error("Error fetching total grade:", err);
        return 0; // Changed here
      }
    };

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
      if (user.role === "Student" && user.id) {
        console.log(user.id, class_id);
        Promise.all([
          fetchFeedback(class_id, user.id),
          fetchTotalGrade(class_id, user.id)
        ]).then(([feedback, totalGrade]) => {
          setFeedback(feedback);
          setTotalGrade(totalGrade);
        });
      }
    }
  }, [class_id, user]);

  useEffect(() => {
    if (students && classDetails) {
      setLoading(false);
    }
  }, [students, classDetails])

  function percentToLetterGrade(percent) {
    if (percent === null || percent === undefined) {
      return "N/A";
    }

    const numericPercent = typeof percent === 'string' ? parseFloat(percent) : percent;

    if (numericPercent >= 90) {
      return "A";
    } else if (numericPercent >= 80) {
      return "B";
    } else if (numericPercent >= 70) {
      return "C";
    } else if (numericPercent >= 60) {
      return "D";
    } else {
      return "F";
    }
  }

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center mx-auto h-screen">loading</div>
      )
        : (
          <div className="max-w-[900px] container flex flex-1 flex-col mx-auto space-y-8 p-8">
            <h1 className="text-3xl font-bold mb-6">Class Details</h1>
            <Card className="">
              <CardHeader className="w-[400px]">
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
            {(user.role === "Teacher" || user.role === 'Admin') && (
              <Card className="">
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent>
                  <DataTable columns={user.role === 'Teacher' ? columns : columnsAdmin} data={students} />
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">Total Students: {students.length}</p>
                </CardFooter>
              </Card>
            )}
            {user.role === "Student" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col flex-1 space-y-4">
                  <Link href={`/classes/${class_id}/grades`} className="flex-1 justify-center hover:scale-105 transition-transform">
                    <Card className="col-span-1 flex flex-col justify-center">
                      <CardHeader>
                        <CardTitle>Grade</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Your current grade in this class</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold tabular-nums text-center">
                          {totalGrade !== null && totalGrade !== undefined ? parseFloat(totalGrade).toFixed(2) + "% (" + percentToLetterGrade(totalGrade) + ")" : "N/A"}
                        </p>
                      </CardContent>
                      <CardFooter>
                      </CardFooter>
                    </Card>
                  </Link>

                  <Link href={`/classes/${class_id}/assignments`} className="flex-1 justify-center hover:scale-105 transition-transform">
                    <Card className="h-full flex flex-col justify-center">
                      <CardHeader>
                        <CardTitle>Assignments</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">View your assignments and grades</CardDescription>
                      </CardHeader>
                      <CardContent>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Your Feedback</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent>
                    {feedback ? (
                      <div className="space-y-4">
                        <p>{feedback.message}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No feedback available for this class.</p>
                    )}
                  </CardContent>
                  <CardFooter>

                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        )}
    </Layout>
  );
}

