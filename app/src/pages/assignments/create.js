import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Layout } from "@/components/layout/Layout";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getAllClassesForTeacher } from '@/components/api/api';


export default function CreateAssignment(/*cid=null, cname=null*/) {
  const router = useRouter();
  // const { class_id } = router.query;
  const [class_id, setClassId] = useState(null);
  const [classList, setClassList] = useState([]);
  const [activeClass, setActiveClass] = useState(null);

  const [user, setUser] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [crumbs, setCrumbs] = useState([
    { name: "Home", href: "/dashboard" },
    { name: "Assignments", href: `/assignments` },
    { name: "Create Assignment", href: `/assignments/create` },
  ]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      class_id: class_id || "",
    },
  });

  // Get user from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => {console.log("Returning logged out user to main")})
    }
    const user = jwtDecode(token);
    setUser(user['sub']);

    // console.log(cid, cname);
    // if (cname && cid) {
    //   setActiveClass(cname);
    //   setClassId(cid);
    // }
  }, []);
  
  // get classes
  useEffect(() => {
    if (user && user['role'] === 'Teacher') {
      getAllClassesForTeacher(user['id'])
        .then((data) => {
          setClassList(data);
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    }
  }, [user]);

  // get class info
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded["sub"]);

        if (decoded["sub"]["role"] !== "Teacher") {
          router.push("/");
          return;
        }

        if (class_id) {
          try {
            const response = await axios.get(`${config.backendUrl}/class/${class_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              },
              timeout: 10000 // 10 seconds timeout
            });
            setClassInfo(response.data);
            // setCrumbs(prevCrumbs => {
            //   const updatedCrumbs = [...prevCrumbs];
            //   updatedCrumbs[2] = { name: response.data.class.class_name, href: `/classes/${class_id}` };
            //   return updatedCrumbs;
            // });
          } catch (error) {
            if (error.code === 'ECONNABORTED') {
              alert("Connection timeout. Please check your network and try again.");
            } else if (error.response) {
              // Server responded with error status
              if (error.response.status === 401) {
                alert("Session expired. Please login again.");
                router.push("/login");
              } else if (error.response.status === 404) {
                alert("Class not found. You may not have access to this class.");
                router.push("/classes");
              } else {
                alert(`Error loading class: ${error.response.data.message || "Server error"}`);
              }
            } else if (error.request) {
              // No response received
              alert("Cannot connect to server. Please check your internet connection.");
            } else {
              console.error("Error fetching class info:", error);
              alert("An unexpected error occurred. Please try again.");
            }
          }
        }
      } catch (jwtError) {
        console.error("Invalid token:", jwtError);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchData();
  }, [class_id, router]);

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt for the AI");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${config.backendUrl}/ai/generate-assignment`,
        {
          prompt: aiPrompt,
          class_info: classInfo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000
        }
      );
      console.log(response.data);

      const { title, description, suggested_due_date } = response.data['assignment'];

      // Update form fields
      form.setValue("title", title);
      form.setValue("description", description);
      setGeneratedContent(description);

      if (suggested_due_date) {
        form.setValue("due_date", suggested_due_date);
      }

    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error ||
        error.message ||
        "AI service unavailable";

      if (status === 401) {
        router.push("/login");
        return;
      }

      alert(`AI Error (${status || '000'}): ${errorMessage}`);
      console.error("AI Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedContent = () => {
    if (generatedContent) {
      form.setValue("description", generatedContent);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.backendUrl}/assignments`, {
        ...data,
        class_id: class_id,
      });

      const resIds = await axios.get(`${config.backendUrl}/classes/students/${class_id}`);
      console.log("Response from creating assignment:", resIds.data);
      const studentIds = resIds.data.students.map(student => student.user_id);

      // Send a message to each student
      await Promise.all(studentIds.map(async (receiver_user_id) => {
        return axios.post(`${config.backendUrl}/messages`, {
          class_id: class_id,
          sender_user_id: user.id,
          message: `New assignment created: ${data.title}`,
          title: data.title,
          receiver_user_id: receiver_user_id,
        });
      }));
      console.log("Assignment created successfully:", response.data);
      router.push(`/classes/${class_id}/assignments`);
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Layout breadcrumbs={crumbs} title="Create Assignment">
      <div className="container max-w-[800px] mx-auto flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6">Create Assignment</h1>
        <div className="mb-8">
          {/* <SelectClass classList={classList} classId={class_id} setClassId={setClassId} /> */}
            <Select 
            value={0}
            onValueChange={(value) => {
              setActiveClass(value[0]);
              setClassId(value[1]);
            }}>
            <SelectTrigger>
            <SelectValue placeholder="Class">
              {activeClass || "Class"}
            </SelectValue>
            </SelectTrigger>
            <SelectContent>
            {[...new Set(classList.map((row) => ([row.class_name, row.id])))].map(([className, id]) => (
              <SelectItem key={className} value={[className, id]}>
              {className}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>

          <h2 className="text-xl font-semibold">
            Class: {activeClass || "None Selected"}
          </h2>
          <p className="text-gray-600">ID: {class_id || "---"}</p>
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
                    <Input placeholder="Enter assignment title" {...field} />
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
                    <Textarea
                      placeholder="Enter assignment description"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Generation Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">AI Assignment Generator</h3>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Describe what you want to generate:
                </label>
                <Textarea
                  placeholder="e.g., 'Create a math assignment about fractions for 6th grade with 5 problems'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isGenerating}
                />
              </div>

              <Button
                type="button"
                onClick={generateWithAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>

              {generatedContent && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">AI Generated Content:</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyGeneratedContent}
                    >
                      Apply to Form
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
                  </div>
                </div>
              )}
            </div>

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
    </Layout>
  );
}