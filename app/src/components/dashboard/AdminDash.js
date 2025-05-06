import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";


const AdminDash = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    setUser(user['sub']);
  }, []);


  if (!user) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
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
    <div>
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <p>Welcome, {user['first_name']} {user['last_name']}</p>
          <div className="grid auto-rows-min grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                  <Link href="/admin/classes">Manage classes</Link>
                  <Link href="/admin/semesters">Manage semesters</Link>
                  <Link href="/calendar">View Calendar</Link>
                  <Link href="/admin/payments">Manage Donations</Link>
                  <Link href="/admin/users">Manage Users</Link>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDash;
