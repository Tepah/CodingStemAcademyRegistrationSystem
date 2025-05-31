"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Select, SelectTrigger, SelectItem, SelectGroup, SelectContent, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { postSemester } from "@/components/api/api";

const semesterSchema = z.object({
    name: z.string().min(1, "Semester name is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    rate: z.number().optional(),
    status: z.enum(["Ongoing", "Completed", "Upcoming"], {
        required_error: "Status is required",
    }),
}).superRefine(({ start_date, end_date }, ctx) => {
    if (start_date >= end_date) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["end_date"], // path to the error
      });
    }
  })

export const SemesterForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(semesterSchema),
        defaultValues: {
            name: "",
            start_date: "",
            end_date: "",
            status: "",
        },
    });

    const handleSubmit = async (data) => {
        console.log("Form data:", data);
        setIsSubmitting(true);
        postSemester(data)
            .then((res) => {
                router.push("/admin/semesters");
            })
            .catch((error) => {
                console.error("Error creating semester:", error);
                alert("Error creating semester");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semester Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Semester Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input className="w-[150px]"type="date" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input className="w-[150px]"type="date" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status">
                                                {field.value || "Status"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                                <SelectItem value="Complete">Complete</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>Default Rate($)</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row space-x-2">
                                    <Input className="max-w-[100px]" type="number" placeholder="Rate" {...field} onChange={(e) => {
                                        const parsedValue = parseFloat(e.target.value);
                                        field.onChange(isNaN(parsedValue) ? null : parsedValue);
                                    }} />
                                    <span className="text-sm text-gray-500">per hour</span>
                                    </div>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}