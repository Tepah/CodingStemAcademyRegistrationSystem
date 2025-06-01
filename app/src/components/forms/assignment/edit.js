import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import config from "@/config"
import {jwtDecode} from "jwt-decode"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"


const formSchema = z.object({
    id: z.number(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    due_date: z.string().min(1, "Due date is required"),
})


export default function EditAssignmentForm({ assignmentData }) {
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(date.getDate()+1).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return ''; // Return an empty string in case of an error
        }
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...assignmentData,
            due_date: formatDateForInput(assignmentData.due_date),
        }
    })


    const router = useRouter()

    function onSubmit(data) {
        try {
            Promise.all([
                axios.post(`${config.backendUrl}/assignments`, {
                    ...data,
                    class_id: class_id,
                })
                    .then((response) => {
                        console.log("Assignment created successfully:", response.data)
                    })
                    .catch((error) => {
                        console.error("Error creating assignment:", error)
                    }),
                axios.get(`${config.backendUrl}/class`, {
                    params: {
                        id: class_id,
                    },
                })
                    .then((response) => {
                        console.log("Class data retrieved:", response.data)
                        return response.data['class']
                    })
                    .catch((error) => {
                        console.error("Error fetching class data:", error)
                    })
            ])
                .then(() => {
                    const token = localStorage.getItem('token')
                    const user = jwtDecode(token)
                    const user_id = user['sub']['id']

                    axios.get(`${config.backendUrl}/get-student-ids-by-class`, {
                        params: {
                            class_id: class_id,
                        }
                    })
                        .then((response) => {
                            const student_ids = response.data.student_ids
                            student_ids.forEach((student_id) => {
                                axios.post(`${config.backendUrl}/messages`, {
                                    class_id: class_id,
                                    message: `Assignment created for ${class_id}: ${data.title} that is due on ${data.due_date}`,
                                    sender_user_id: user_id,
                                    receiver_user_id: student_id,
                                    title: `New assignment created: ${data.title}`,
                                })
                            })
                        })
                    router.push(`/classes/${class_id}/assignments`)
                })
        } catch (error) {
            console.error("Error creating class:", error)
        }
    }

    return (
        <div className="my-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Label className="text-2xl font-semibold mb-4">Edit Assignment</Label>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
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
                                    <Textarea placeholder="Description" {...field} />
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
                                <div className="flex flex-row justify-between">
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input className="w-[150px]" type="date" placeholder="Due Date" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row justify-between"> 
                        <Button type="submit">Create Assignment</Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}