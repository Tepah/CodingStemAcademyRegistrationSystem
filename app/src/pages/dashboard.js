import {useEffect, useState} from "react";
import { jwtDecode } from 'jwt-decode'
import StudentDash from "@/components/dashboard/StudentDash";
import TeacherDash from "@/components/dashboard/TeacherDash";
import AdminDash from "@/components/dashboard/AdminDash";
import {Layout, LayoutWithCalendar} from "@/components/layout/Layout";

export default function Dashboard() {
  const [role, setRole] = useState('');
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
  ];


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
      <Layout breadcrumbs={crumbs}>
        <AdminDash />
      </Layout>
    );
  }

  return (
    <LayoutWithCalendar breadcrumbs={crumbs}>
      {role === 'Student' && <StudentDash />}
      {role === 'Teacher' && <TeacherDash />}
    </LayoutWithCalendar>
  );
}
