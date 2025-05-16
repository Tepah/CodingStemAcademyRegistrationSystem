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
import { content } from "@/tailwind.config"


const formSchema = z.object({
    content: z.string().min(1, "Submission is required"),
})


export function SubmissionForm({assignment_id, user_id}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "", 
        },
    })


    const router = useRouter()

    function onSubmit(data) {
        try {
            axios.post(`${config.backendUrl}/submission`, {
                ...data,
                assignment_id: assignment_id,
                student_id: user_id,
            })
            .then((response) => {
                console.log("Submission created successfully:", response.data)
                router.push(`/classes/`)
            })
            .catch((error) => {
                console.error("Error creating submission:", error)
            })
        } catch (error) {
            console.error("Error creating submission:", error)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Submission</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Submission link" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create Submission</Button>
                </form>
            </Form>
        </div>
    )
}