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

const formSchema = z.object({
    class_name: z.string().min(1, {
        message: "Class name is required",
    }),
    subject: z.string().min(1, {
        message: "Subject is required",
    }),
    day: z.string().min(1, {
        message: "Day is required",
    }),
    start_time: z.string().min(1, {
        message: "Start time is required",
    }),
    end_time: z.string().min(1, {
        message: "End time is required",
    }),
    semester_id: z.string().min(1, {
        message: "Semester is required",
    }),
    teacher_id: z.string().min(1, {
        message: "Teacher is required",
    }),
    rate: z.preprocess(
        (val) => {
            if (val === "" || val === undefined) {
                return undefined; // Remove the field if it's empty
            }
            const num = Number(val);
            return isNaN(num) ? undefined : num; // Parse to number, remove if NaN
        },
        z.number().min(0).optional()
    )
})

export function ClassForm({ semesters, teachers }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            class_name: "",
            subject: "",
            day: "",
            start_time: "",
            end_time: "",
            semester_id: "",
            teacher_id: "",
            rate: "",
        },
    })


    const router = useRouter()

    function onSubmit(data) {
        try {
            const semester = semesters.find((semester) => semester.id === parseInt(data.semester_id, 10))

            data.teacher_id = parseInt(data.teacher_id, 10)
            data.semester_id = parseInt(data.semester_id, 10)
            data.rate = data.rate === undefined ? (semester.rate !== undefined ? semester.rate : undefined) : data.rate;
            console.log("Form data:", data)
            axios.post(`${config.backendUrl}/add-class`, data)
                .then((response) => {
                    console.log("Class created:", response.data['message'])
                    router.push('/admin/classes?' + (data.semester_id ? `semester_id=${data.semester_id}` : ''))
                })
                .catch((error) => {
                    console.error("Error creating class:", error)
                })
        } catch (error) {
            console.error("Error creating class:", error)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="class_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Class Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input placeholder="Subject" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                <FormLabel>Day</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value} // Bind the value to formData.day
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Day" />
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
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input className="w-[120px]" type="time" placeholder="Start Time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input className="w-[120px]" type="time" placeholder="End Time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="semester_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                <FormLabel>Semester</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value} // Bind the value to formData.semester_id
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            {semesters.length > 0
                                                ? semesters.find((semester) => semester.id === parseInt(field.value, 10))?.name || "Semester"
                                                : "N/A"}
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
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="teacher_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                <FormLabel>Teacher</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value} // Bind the value to formData.teacher_id
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {teachers.length > 0
                                                    ? field.value === "" ? "Teacher" : teachers.find((teacher) => teacher.id === parseInt(field.value, 10))?.first_name + " " + teachers.find((teacher) => teacher.id === parseInt(field.value, 10))?.last_name || "Teacher"
                                                    : "N/A"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {teachers.map((teacher) => (
                                                    <SelectItem key={teacher.id} value={teacher.id}>
                                                        {teacher.first_name} {teacher.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
                                
                                <div className="flex flex-col">
                                    <FormLabel>Rate($) per hour (Optional)</FormLabel>
                                    <FormMessage />
                                </div>
                                <div className="flex flex-col w-[120px] space-x-2">

                                    <FormControl>
                                        <Input className="" type="number" placeholder="Rate" {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? undefined : parseFloat(value));
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Class</Button>
                </form>
            </Form>
        </div>
    )
}