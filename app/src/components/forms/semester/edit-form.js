"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Select, SelectTrigger, SelectItem, SelectGroup, SelectContent, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { updateSemester } from "@/components/api";
import { set } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { deleteSemester } from "@/components/api";

const semesterSchema = z.object({
    name: z.string().min(1, "Semester name is required"),
    start_date: z.string(),
    end_date: z.string(),
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
  }).superRefine(({start_date}, ctx) => {
    if (new Date(start_date) <= new Date()) {
        ctx.addIssue({
          code: "custom",
          message: "Start date must be in the future",
          path: ["start_date"], // path to the error
        });
      }
  })

export const ModifySemesterForm = ({ semester }) => {
    console.log("Semester data:", semester);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(semesterSchema),
        defaultValues: {
            name: semester.name,
            start_date: new Date(semester.start_date).toISOString().split("T")[0],
            end_date: new Date(semester.end_date).toISOString().split("T")[0],
            status: semester.status,
        },
    });

    const handleSubmit = async (data) => {
        try {
            data["id"] = semester.id;
            setIsSubmitting(true);
            updateSemester(data)
                .then((response) => {
                    console.log("Semester updated successfully:", response);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error updating semester:", error);
                    setIsSubmitting(false);
                });
        } catch (error) {
            console.error("Error updating semester:", error);
        }
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
                        <FormItem className="flex flex-row justify-between">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input className="w-[150px]"type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-between">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input className="w-[150px]"type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-between">
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
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Complete">Complete</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row justify-between">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <DeleteSemesterDialog semester={semester} />
                </div>
            </form>
        </Form>
    );
}

const DeleteSemesterDialog = ({ semester }) => {
    const [open, setOpen] = React.useState(false);

    const handleDelete = async () => {
        try {
            await deleteSemester(semester.id);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting semester:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the semester.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="destructive" onClick={handleDelete}>
                    Delete
                </Button>
            </DialogContent>
        </Dialog>
    );
}