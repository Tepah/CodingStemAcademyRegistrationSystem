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
import { useEffect } from 'react';

const paymentSchema = z.object({
    student_id: z.number().int().refine(value => value === null || (typeof value === 'number'), {
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
    payment_type: z.enum(["Donation", "Tuition", "Misc"]),
    payment_method: z.enum(["Cash", "Check", "Online"])
})

export function CreatePaymentForm({ children, student_id = null }) {
    const [selectedStudentId, setSelectedStudentId] = useState(student_id || null);
    const router = useRouter();
    const [error, setError] = useState(null);

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            student_id: selectedStudentId,
            amount: "",
            status: "",
            notes: "",
            payment_date: "",
            payment_type: "",
            payment_method: ""
        }
    })

    useEffect(() => {
        if (student_id) {
            setSelectedStudentId(parseInt(student_id, 10));
            form.setValue("student_id", parseInt(student_id, 10));
        }
    }, [student_id]);

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axios.post(`${config.backendUrl}/payment`, data)
            console.log(response.data)
            if (!student_id) {
                router.push("/admin/payments");
            } else {
                router.push(`/admin/users/payments/${student_id}`);
            }
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data) {
                setError(error.response.data.message || "An error occurred while submitting the form.");
            } else {
                setError("An unexpected error occurred.");
            }
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
                                <FormLabel>Payment Date</FormLabel>
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
                                <FormLabel>Payment Type</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Tuition">Tuition</SelectItem>
                                                <SelectItem value="Donation">Donation</SelectItem>
                                                <SelectItem value="Misc">Miscellaneous</SelectItem>
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
                    name="payment_method"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row justify-between">
                            <FormLabel>Payment Method</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Check">Check</SelectItem>
                                            <SelectItem value="Online">Online</SelectItem>
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
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </Form>
    )
}
