import React, {useEffect} from 'react';
import {Layout} from "@/app/layout";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/config";
import {DataTable} from "@/components/tables/users/data-table";
import {columns} from "@/components/tables/users/columns";
import {Label} from "@/components/ui/label";
import { RegisterAdminDialog } from '@/components/dialogs/NewAdminDialog';


export default function Users() {
  const router = useRouter()
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Admins', href: '/admin/users/admins' }
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
    const fetchUsers = async () => {
      axios.get(`${config.backendUrl}/admins`)
        .then((response) => {
          console.log(response.data);
          setUsers(response.data['admins']);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
      }
    if (user['role'] === 'Admin') {
      console.log("Fetching users");
      fetchUsers().then(() => console.log("Fetched users"));
    }
    setLoading(false);
  }, [user])

  return (
    <Layout breadcrumbs={crumbs}>
      <div className="container mx-auto flex flex-col flex-1 max-w-[900px] p-8">
      <Label>
        <h1 className="text-3xl font-bold">Admins</h1>
        <p className="text-gray-500">Manage admins in the system</p>
      </Label>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      ) : user['role'] === 'Admin' ? (
        <DataTable columns={columns} data={users}>
          <RegisterAdminDialog />
        </DataTable>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold">You are not authorized to view this page</h1>
        </div>
      )}
      </div>
    </Layout>
  );

}
