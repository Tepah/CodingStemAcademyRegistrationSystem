import React, { useImperativeHandle, forwardRef } from "react"
import axios from 'axios';
import config from "@/config";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

const formSchema = z.object({
    first_name: z.string().min(1, {
        message: "First name is required",
    }),
    last_name: z.string().min(1, {
        message: "Last name is required",
    }),
    birth_date: z
        .object({
            month: z
                .string()
                .regex(/^(0?[1-9]|1[0-2])$/, { message: "Invalid month" }), // Allows 1-9 and 10-12
            day: z
                .string()
                .regex(/^(0?[1-9]|[12][0-9]|3[01])$/, { message: "Invalid day" }), // Allows 1-9, 10-29, and 30-31
            year: z
                .string()
                .regex(/^\d{4}$/, { message: "Invalid year" }) // Validates YYYY
        })
        .refine((date) => {
            const fullDate = `${date.year}-${date.month}-${date.day}`;
            return !isNaN(new Date(fullDate).getTime()); // Ensures the date is valid
        }, { message: "Invalid date" })
        .refine((date) => {
            const year = parseInt(date.year);
            const currentYear = new Date().getFullYear();
            return year >= 1900 && year <= currentYear;
        }, { message: "Year must be between 1900 and the current year" }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string()
        .min(6, {
            message: "Password must be at least 6 characters long",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
    confirm_password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits",
    }),
    address: z.string().min(1, {
        message: "Address is required",
    }),
    role: z.enum(["Student", "Admin", "Teacher"]),
    experience: z.string().optional()
})


const TeacherRegisterForm = forwardRef(({ setLoading }, ref) => {
    const router = useRouter();
    const dayRef = React.useRef(null);
    const monthRef = React.useRef(null);
    const yearRef = React.useRef(null);
    const [error, setError] = React.useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            birth_date: {
                month: "",
                day: "",
                year: "",
            },
            email: "",
            password: "",
            confirm_password: "",
            gender: "",
            phone: "",
            address: "",
            guardian: null,
            guardian_phone: null,
            health_ins: null,
            health_ins_number: null,
            role: "Teacher",
            grade_level: null,
            experience: "",
        },
    })

    useImperativeHandle(ref, () => ({
        requestSubmit: form.handleSubmit(handleSignUp)
    }));


    function handleSignUp(values) {
        // `data` contains the validated form data
        setLoading(true);
        if (values.password !== values.confirm_password) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }
        values.birth_date = format(new Date(`${values.birth_date.year}-${values.birth_date.month}-${values.birth_date.day}`), 'yyyy-MM-dd');
        delete values.confirm_password;

        axios.post(`${config.backendUrl}/register`, values).then(response => {
            console.log("Successfully registered: " + response.data['message']);
            if (response.data['access_token']) {
                router.refresh();
            } else {
                setLoading(false);
                throw new Error(response.data['message']);
            }
        }).catch(error => {
            console.log(error);
            setError("Email already exists or an error occurred during registration.");
        });
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)}>
                <div className="grid space-y-4 grid-cols-1 lg:grid-cols-2 gap-x-8">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birth_date"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row items-center justify-between">
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <div className="flex space-x-2">
                                        {/* Month Input */}
                                        <Input
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            className="w-12 text-center"
                                            ref={monthRef}
                                            value={field.value?.month || ""}
                                            onChange={(e) => {
                                                const month = e.target.value;
                                                field.onChange({ ...field.value, month });
                                                if (month.length === 2) {
                                                    dayRef.current.focus();
                                                }
                                            }}
                                        />
                                        {/* Day Input */}
                                        <Input
                                            type="text"
                                            placeholder="DD"
                                            maxLength={2}
                                            className="w-12 text-center"
                                            ref={dayRef}
                                            value={field.value?.day || ""}
                                            onChange={(e) => {
                                                const day = e.target.value;
                                                field.onChange({ ...field.value, day });
                                                if (day.length === 2) {
                                                    yearRef.current.focus();
                                                }
                                            }}
                                        />
                                        {/* Year Input */}
                                        <Input
                                            type="text"
                                            placeholder="YYYY"
                                            maxLength={4}
                                            className="w-16 text-center"
                                            ref={yearRef}
                                            value={field.value?.year || ""}
                                            onChange={(e) => {
                                                const year = e.target.value;
                                                field.onChange({ ...field.value, year });
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row items-center justify-between">
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Experience</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Experience" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )} 
            </form>
        </Form>
    );
});

TeacherRegisterForm.displayName = "TeacherRegisterForm";

export default TeacherRegisterForm;