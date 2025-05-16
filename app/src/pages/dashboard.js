import {useEffect, useState} from "react";
import { jwtDecode } from 'jwt-decode'
import StudentDash from "@/components/ClassRegistration/dashboard/StudentDash";
import TeacherDash from "@/components/ClassRegistration/dashboard/TeacherDash";
import AdminDash from "@/components/ClassRegistration/dashboard/AdminDash";
import {Layout, LayoutWithCalendar} from "@/app/layout";

export default function Dashboard() {
  const [role, setRole] = useState('');


  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token found in local storage");
        window.location.href = "/";
      } else {
        const user = jwtDecode(token);
        console.log(user['sub']);
        setRole(user['sub']['role']);
      }
    };

    fetchRole().then(() => console.log("Role set"));
  }, []);
  if (role === 'Admin') {
    return (
      <Layout>
        <AdminDash />
      </Layout>
    );
  }

  return (
    <LayoutWithCalendar>
      {role === 'Student' && <StudentDash />}
      {role === 'Teacher' && <TeacherDash />}
    </LayoutWithCalendar>
  );
}
