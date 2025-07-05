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

const paymentSchema = z.object({
    student_id: z.number().int(),
    amount: z.number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
    }).positive(),
    status: z.enum(["Compete", "Refund", "Balance"]),
    notes: z.string().optional(),
    payment_date: z.date(),
    payment_type: z.enum(["cash", "check", "zelle"]),
})

export function ModifyPaymentForm({ children, paymentData, formRef }) {
    const form = useForm({
        resoslver: zodResolver(paymentSchema),
        defaultValues: {
            id: paymentData.id || "",
            student_id: paymentData.student_id || "",
            amount: paymentData.amount || "",
            status: paymentData.status || "",
            notes: paymentData.notes || "",
            payment_date: new Date(paymentData.payment_date).toISOString().split("T")[0] || "",
            payment_type: paymentData.payment_type || ""
        }
    })

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axios.put(`${config.backendUrl}/payment`, data)
            console.log(response.data)
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full" >
                <div className="space-y-8 overflow-y-auto flex-grow px-2 py-4">
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
                            <FormItem className="flex flex-row justify-between">
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
                                <FormLabel>Donation Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="payment_type"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between">
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}