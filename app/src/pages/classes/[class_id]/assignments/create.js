import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function CreateAssignment() {
  const router = useRouter();
  const { class_id } = router.query;
  
  const [user, setUser] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [assignments, setAssignments] = useState([]);


  const form = useForm({
    defaultValues: {
      description: "",
      due_date: "",
      class_id: class_id || "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    const decoded = jwtDecode(token);
    setUser(decoded["sub"]);

    if (decoded["sub"]["role"] !== "Teacher") {
      router.push("/");
      return;
    }

    if (class_id) {
      axios.get(`${config.backendUrl}/class/${class_id}`)
        .then((response) => {
          setClassInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching class info:", error);
        });

      axios.get(`${config.backendUrl}/assignments`, { params: { class_id: class_id } })
        .then((response) => {
          setAssignments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching assignments:", error);
        });
    }
  }, [class_id]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        class_id: class_id,
      };
      const response = await axios.post(`${config.backendUrl}/assignments`, payload);
      console.log("Assignment created successfully:", response.data);
      router.push(`/classes/${class_id}/assignments`);
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };
  console.log("SYnau")
  console.log(classInfo.class_name)
  return (
    
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Assignment</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Class: {classInfo.class.class_name}</h2>
        <p className="text-gray-600">ID: {class_id}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter assignment description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Assignment
          </Button>
        </form>
      </Form>
    </div>
  );
}
