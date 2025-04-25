import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSemester } from "@/components/api";
import axios from 'axios';
import config from '@/config';
import ClassCard from './dashboard/class-cards';

const StudentDash = () => {
  const [user, setUser] = useState({});
  const [semester, setSemester] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    setUser(user['sub']);
    getCurrentSemester().then((res) => {
      console.log(res);
      setSemester(res);
    })
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${config.backendUrl}/student-classes-by-semester`, {
          params: {
            semester_id: semester.id,
            student_id: user['id'],
          }
        })
        console.log(res.data);
        return res.data['classes'];
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }

    const fetchTeacher = async (id) => {
      try {
        const res = await axios.get(`${config.backendUrl}/user`, { params: { id: id } });
        console.log("Fetched teacher:", res.data);
        return res.data["user"];
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    }

    if (semester && user) {
      fetchClasses().then((res) => {
        const updatedClasses = res.map(async (classItem) => {
          const teacher = await fetchTeacher(classItem['teacher_id']);
          return { ...classItem, teacher: teacher };
        });
        Promise.all(updatedClasses).then((data) => {
          setClasses(data);
        });
      });
    }
  }, [semester, user]);

  if (!user || !classes) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Teacher Dashboard</h1>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="w-[300px] h-[200px] rounded-xl" />
            <Skeleton className="w-[300px] h-[200px] rounded-xl" />
            <Skeleton className="w-[300px] h-[200px] rounded-xl" />
            <Skeleton className="w-[300px] h-[200px] rounded-xl" />
            <div className="w-[300px] h-[200px] grid grid-cols-1 gap-4">
              <Skeleton className="w-[300px] h-[40px] rounded-xl" />
              <Skeleton className="w-[300px] h-[40px] rounded-xl" />
              <Skeleton className="w-[300px] h-[40px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Student Dashboard</h1>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p>Welcome, {user['first_name']} {user['last_name']}</p>
        <div className="grid auto-rows-min grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((classData) => (
          <ClassCard classData={classData}  />
        ))}
        <div>
            <Link href="/classes" className="w-full h-2/3 flex items-center justify-center rounded-xl">
              <p className="text-center text-gray-500">View All Classes...</p>
            </Link>
          </div>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 space-y-2">
              <Link href="/courses">View Courses</Link>
              <Link href="/register-classes">Enroll in a Course</Link>
              <Link href="/assignments">View Assignments</Link>
              <Link href="/calendar">View Calendar</Link>
              <Link href="/grades">View Grades</Link>
            </ul>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  );
}

export default StudentDash;
