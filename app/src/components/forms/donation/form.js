import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectItem, SelectGroup, SelectContent, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import config from "@/config";
import StudentNamePopover from "@/components/popovers/StudentNamePopover";
import { useRouter } from 'next/router';

const paymentSchema = z.object({
    student_id: z.number().int().nullable().refine(value => value === null || (typeof value === 'number'), {
        message: "Student is required",
    }),
    amount: z.string({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
    }).refine(value => !isNaN(parseFloat(value)), {
        message: "Amount must be a valid number",
    }),
    status: z.enum(["Complete", "Refund", "Balance"]),
    notes: z.string().optional(),
    payment_date: z.string(),
    payment_type: z.enum(["cash", "check", "zelle"]),
})

export function CreatePaymentForm({ children, student_id = null }) {
    const [selectedStudentId, setSelectedStudentId] = useState(student_id || null);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            student_id: selectedStudentId,
            amount: "",
            status: "",
            notes: "",
            payment_date: "",
            payment_type: ""
        }
    })

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axios.post(`${config.backendUrl}/payment`, data)
            console.log(response.data)
            if (!student_id) {
                router.push("/admin/donations");
            } else {
                router.push(`/admin/donations/${data.student_id}`);
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleSelectStudent = (studentId) => {
        if (studentId) {
            setSelectedStudentId(studentId);
            form.setValue("student_id", parseInt(studentId, 10));
        } else {
            setSelectedStudentId(null);
            form.setValue("student_id", null);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {!student_id && (
                    <FormField
                        control={form.control}
                        name="student_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Student ID"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsedValue = value ? parseInt(value, 10) : "";
                                            field.onChange(parsedValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                <StudentNamePopover onSelectStudent={handleSelectStudent} />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input placeholder="Amount" {...field} />
                            </FormControl>
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
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Complete">Complete</SelectItem>
                                                <SelectItem value="Refund">Refund</SelectItem>
                                                <SelectItem value="Balance">Balance</SelectItem>
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
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="payment_date"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>Donation Date</FormLabel>
                                <FormControl>
                                    <Input type="date" className="w-1/3" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="payment_type"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                                <FormLabel>Donation Type</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select donation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="check">Check</SelectItem>
                                                <SelectItem value="zelle">Zelle</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}