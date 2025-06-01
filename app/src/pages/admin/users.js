import React, { useEffect, useState } from 'react';
import { Layout } from "@/app/layout";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@/config";
import { DataTable } from "@/components/tables/users/data-table";
import { columns } from "@/components/tables/users/columns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";


export default function Users() {
  const router = useRouter()
  const [user, setUser] = React.useState({});
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Users', href: '/admin/users' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => {
        console.log('Redirected to home page')
      })
    } else {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken['sub']);
      console.log("Decoded token:", decodedToken);
    }
  }, [router]);

  if (user['role'] !== 'Admin') {
    return (
      <Layout breadcrumbs={crumbs}>
        <div className="container mx-auto flex flex-col flex-1 max-w-[900px] p-8">
          <Label>
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p className="text-gray-500">You do not have permission to view this page</p>
          </Label>
        </div>
      </Layout>
    )
  }

  return (
    <Layout breadcrumbs={crumbs}>
      <div className="container flex flex-col mx-auto flex-1 max-w-[900px] p-8 gap-4">


        <div className="flex flex-col gap-2">
          <Label className="text-2xl font-bold">Users</Label>
          <p className="text-gray-500">Manage users in the system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Link href="/admin/users/students">
          <Card className="flex flex-col justify-center min-h-[200px] hover:cursor-pointer hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage student accounts.</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
          </Link>

          <Link href="/admin/users/teachers">
          <Card className="flex flex-col justify-center min-h-[200px] hover:cursor-pointer hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>Manage teacher accounts.</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
          </Link>

          <Link href="/admin/users/admins">
          <Card className="flex flex-col justify-center min-h-[200px] hover:cursor-pointer hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
              <CardDescription>Manage administrator accounts.</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );

}
