import React, {useEffect} from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import {Label} from "@/components/ui/label";
import {DataTable} from "@/components/tables/semesters/data-table";
import { getSemesters } from '@/components/api/api';
import { columns } from "@/components/tables/semesters/columns";


export default function Semesters() {
  const router = useRouter()
  const [semesters, setSemesters] = React.useState([]);
  const [user, setUser] = React.useState({});
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Semesters', href: '/admin/semesters' }
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

  useEffect(() => {
    
    getSemesters().then((data) => {
      console.log("Semesters data:", data);
      setSemesters(data);
    }).catch((error) => {
      console.error("Error fetching semesters:", error);
    });
  }, [user])

  return (
    <Layout breadcrumbs={crumbs}>
      <div className="container mx-auto flex flex-col space-y-4 max-w-[1000px] p-8">
      <Label>
        <h1 className="text-3xl font-bold">Semesters</h1>
        <p className="text-gray-500">Manage Semesters in the system</p>
      </Label>
      {user['role'] === 'Admin' ? (
        <DataTable columns={columns} data={semesters} />
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold">You are not authorized to view this page</h1>
        </div>
      )}
      </div>
    </Layout>
  );

}
