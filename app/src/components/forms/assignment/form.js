import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import config from "@/config"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"


const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    due_date: z.string().min(1, "Due date is required"),
})


export function AssignmentForm({class_id}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            due_date: "",
            title: "",
        },
    })


    const router = useRouter()

    function onSubmit(data) {
        try {
            axios.post(`${config.backendUrl}/assignments`, {
                ...data,
                class_id: class_id,
            })
            .then((response) => {
                console.log("Assignment created successfully:", response.data)
                router.push(`/classes/${class_id}/assignments`)
            })
            .catch((error) => {
                console.error("Error creating assignment:", error)
            })
        } catch (error) {
            console.error("Error creating class:", error)
        }
    }

    return (
        <div className="w-[300px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit">Create Assignment</Button>
                </form>
            </Form>
        </div>
    )
}