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
import { SheetClose } from "@/components/ui/sheet"

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
    rate: z.number().nullable().optional().refine((value) => value === null || value >= 0, {
        message: "Rate must be a positive number or null",
    }),
})

function convertTo24HourFormat(time) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
        hours = "00";
    }

    return `${hours}:${minutes}`;
}

export function ClassForm({ classData, semesters, teachers, formRef }) {
    console.log("Class data:", classData)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            class_name: classData.class_name || "",
            subject: classData.subject || "",
            day: classData.day || "",
            start_time: convertTo24HourFormat(classData.start_time) || "9:00",
            end_time: convertTo24HourFormat(classData.end_time) || "10:00",
            semester_id: String(classData.semester_id) || "",
            teacher_id: String(classData.teacher_id) || "",
            rate: classData.rate || null,
        },
    })


    const router = useRouter()

    function onSubmit(data) {
        try {
            data.teacher_id = parseInt(data.teacher_id, 10)
            data.semester_id = parseInt(data.semester_id, 10)
            console.log("Form data:", data)
            axios.put(`${config.backendUrl}/update_class/${classData.id}`, data)
                .then((response) => {
                    console.log("Class created:", response.data)
                    router.refresh()
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
                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full" >
                    <div className="space-y-8 overflow-y-auto flex-grow px-2 py-4">
                    <FormField
                        control={form.control}
                        name="class_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Class Name" {...field} />
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
                            <FormItem>
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>Rate</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-row items-center gap-2">
                                                <Input type="number" placeholder="Rate" {...field} onChange={(e) => {
                                                    const value = e.target.value;
                                                    const parsedValue = value ? parseFloat(value) : "";
                                                    field.onChange(parsedValue);
                                                }} />
                                                <p>$</p>
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    </div>
                </form>
            </Form>
        </div>
    )
}