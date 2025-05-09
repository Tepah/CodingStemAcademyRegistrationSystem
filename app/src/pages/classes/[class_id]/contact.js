import { Layout } from "@/app/layout";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@/config";

export default function Grades() {
  const router = useRouter();
  const { class_id } = router.query;
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      axios.get(`${config.backendUrl}/get-teacher-by-class`, {
        params: {
          class_id: class_id
        }
      })
        .then(response => {
          console.log("Teacher data retrieved: ", response.data);
          setTeacherData(response.data['teacher']);
        })
        .catch(error => {
          console.error("Error fetching class data:", error);
        });
    };

    if (class_id) {
      console.log("Fetching class data for class_id: ", class_id)
      fetchClassData().then(r => console.log("Fetched class data"))
        .catch(error => {
          console.error("Error fetching class data:", error);
        });
    }
  }, [class_id])

  useEffect(() => {
    if (teacherData) {
      console.log("Teacher data fetched successfully");
      setLoading(false);
    }
  }, [teacherData]);

  return (
    <Layout title={"Teacher Contact Information"}>
      {loading ? <p>loading</p> : (
        <div className="container mx-auto max-w-[500px] flex flex-1 flex-col gap-4 p-4">
          <Card className={"p-4"}>
            <CardHeader>
              <CardTitle>
                Teacher Contact Information
              </CardTitle>
              <CardDescription>Contact {teacherData['first_name']} {teacherData['last_name']} here</CardDescription>
            </CardHeader>
            <CardContent className={"grid gap-4 grid-cols-2"}>
              <p>Email: {teacherData.email}</p>
              <p>Phone: {teacherData.phone}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}
