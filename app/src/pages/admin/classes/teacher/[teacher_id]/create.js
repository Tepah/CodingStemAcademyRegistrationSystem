import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Layout } from "@/app/layout";
import { jwtDecode } from "jwt-decode";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CreateClass() {
  const router = useRouter();
  const { teacher_id } = router.query;

  const [formData, setFormData] = useState({
    class_name: "",
    subject: "",
    day: "",
    start_time: "",
    end_time: "",
    semester_id: "",
    teacher_id: "", // Pre-fill teacher_id from the URL
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [loadPage, setLoadPage] = useState(false);
  const [teacher, setTeacher] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${config.backendUrl}/add-class`, formData);
      console.log("Class created:", response.data);
      router.push(`/admin/classes/teacher/${teacher_id}`); // Redirect to teacher's classes page
    } catch (err) {
      console.error("Error creating class:", err);
      setError(err.response?.data?.error || "An error occurred while creating the class.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/").then(() => {
        console.log("Redirected to home page");
      });
    }
    const decodedToken = jwtDecode(token);
    setUser(decodedToken["sub"]);
    console.log("Decoded token:", decodedToken);
    
    const fetchSemesters = async () => {
        try {
            const response = await axios.get(`${config.backendUrl}/semesters`);
            setSemesters(response.data['semesters']);
        } catch (err) {
            console.error("Error fetching semesters:", err);
        }
    };

    fetchSemesters()
  }, [router]);

  useEffect(() => {
    const fetchTeacher = async () => {
        try {
            const response = await axios.get(`${config.backendUrl}/user`, {
                params: {
                    id: teacher_id,
                },
            });
            console.log("Fetched teacher:", response.data["user"]);
            setTeacher(response.data["user"]);
        } catch (err) {
            console.error("Error fetching teacher:", err); 
        }
    };
    if (teacher_id) {
        setFormData((prev) => ({
            ...prev,
            teacher_id: teacher_id, // Pre-fill teacher_id from the URL
        }));

        fetchTeacher();
    }
  }, [teacher_id])

    useEffect(() => {
        if (semesters.length > 0 && !formData.semester_id) {
            setFormData((prev) => ({
                ...prev,
                semester_id: semesters[0].id, // Default to the first semester's id
            }));
            console.log(semesters)
        }

        if (semesters.length > 0 && teacher) {
            setLoadPage(true);
        };
    }, [semesters, teacher, formData.semester_id]);

  return (
    <Layout>
        {!loadPage ? (
            <div>
                Loading...
            </div>
        ): (
        <div className="container p-8 w-[400px]">
        <h1 className="text-2xl font-bold mb-6">New class for {teacher.first_name} {teacher.last_name}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <Label htmlFor="class_name">Class Name</Label>
            <Input
                id="class_name"
                name="class_name"
                type="text"
                placeholder="Enter class name"
                value={formData.class_name}
                onChange={handleChange}
                required
            />
            </div>
            <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
            />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="day">Day</Label>
                <Select
                    value={formData.day} // Bind the value to formData.day
                    onValueChange={(day) => {
                        console.log("Selected day:", typeof day);
                        setFormData((prev) => ({
                            ...prev,
                            day: day, // Update day in formData
                        }))
                    }
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-between">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
                id="start_time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                required
            />
            </div>
            <div className="flex justify-between">
            <Label htmlFor="end_time">End Time</Label>
            <Input
                id="end_time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                required
            />
            </div>
            <div className="flex justify-between">
                <Label htmlFor="semester">Semester</Label>
                <Select
                    value={formData.semester_id} // Bind the value to formData.semester_id
                    onValueChange={(id) => {
                        console.log("Selected semester ID:", typeof id);
                        setFormData((prev) => ({
                            ...prev,
                            semester_id: parseInt(id, 10), // Update semester_id in formData
                        }))
                    }
                    }
                >
                    <SelectTrigger>
                    <SelectValue>
                    {semesters.length > 0
                        ? semesters.find((semester) => semester.id === formData.semester_id)?.name || "Semester"
                        : "Naw"}
                    </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                        {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                        </SelectItem>
                        ))}
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button className="flex justify-center" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Class"}
            </Button>
        </form>
        </div>
        )}
    </Layout>
  );
}