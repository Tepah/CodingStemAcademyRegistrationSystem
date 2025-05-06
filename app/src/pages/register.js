import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import axios from 'axios';
import config from '../config';
import { useRouter } from 'next/router';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


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
      .regex(/^(0[1-9]|1[0-2])$/, { message: "Invalid month" }), // Validates MM
    day: z
      .string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])$/, { message: "Invalid day" }), // Validates DD
    year: z
      .string()
      .regex(/^\d{4}$/, { message: "Invalid year" }) // Validates YYYY
      .refine((year) => parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear(), {
        message: "Year must be between 1900 and the current year",
      }),
  })
  .refine((date) => {
    const fullDate = `${date.year}-${date.month}-${date.day}`;
    return !isNaN(new Date(fullDate).getTime()); // Ensures the date is valid
  }, { message: "Invalid date" }),
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
  guardian: z.string().min(1, {
    message: "Guardian name is required",
  }),
  guardian_phone: z.string().min(10, {
    message: "Guardian phone number must be at least 10 digits",
  }),
  health_ins: z.string().min(1, {
    message: "Health insurance is required",
  }),
  health_ins_number: z.string().min(1, {
    message: "Health insurance number is required",
  }),
  role: z.enum(["Student", "Admin", "Teacher"]),
  grade_level: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]),
})

export function DatePicker({field}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {field.value ? format(field.value, "PPP") : <span>Date of Birth</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default function Register() {
  const router = useRouter();
  const gradeLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

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
      guardian: "",
      guardian_phone: "",
      health_ins: "",
      health_ins_number: "",
      role: "Student", // Default role can be "Student"
      grade_level: "", // Leave empty or set a default grade level
    },
  })

  function handleSignUp(values) {
    // `data` contains the validated form data
    if (values.password !== values.confirm_password) {
      alert("Passwords do not match");
      return;
    }
  
    axios.post(`${config.backendUrl}/register`, data).then(response => {
      console.log("Successfully registered: " + response.data['message']);
      if (response.data['access_token']) {
        localStorage.setItem('token', response.data['access_token']);
        router.push('/register-classes').then(() => console.log("Redirecting to register classes"));
      } else {
        throw new Error(response.data['message']);
      }
    }).catch(error => {
      console.log(error);
    });
  }


  return (
    <div className="flex flex-col items-center justify-center p-8 md:h-screen">
      <h1>Register</h1>
      <Card className="p-8">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <div className="grid space-y-8 grid-cols-1 md:grid-cols-2 gap-x-8">
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
              <FormItem className="flex flex-row items-center justify-between">
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                {/* Month Input */}
                <Input
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  className="w-12 text-center"
                  value={field.value?.month || ""}
                  onChange={(e) => {
                    const month = e.target.value;
                    field.onChange({ ...field.value, month });
                  }}
                />
                {/* Day Input */}
                <Input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  className="w-12 text-center"
                  value={field.value?.day || ""}
                  onChange={(e) => {
                    const day = e.target.value;
                    field.onChange({ ...field.value, day });
                  }}
                />
                {/* Year Input */}
                <Input
                  type="text"
                  placeholder="YYYY"
                  maxLength={4}
                  className="w-16 text-center"
                  value={field.value?.year || ""}
                  onChange={(e) => {
                    const year = e.target.value;
                    field.onChange({ ...field.value, year });
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
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
                  <Input placeholder="john@example.com" {...field} />
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
            name="guardian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Guardian Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardian_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Guardian Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="health_ins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Insurance</FormLabel>
                <FormControl>
                  <Input placeholder="Health Insurance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="health_ins_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Insurance Number</FormLabel>
                <FormControl>
                  <Input placeholder="Health Insurance Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade_level"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormLabel>Grade Level</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="flex flex-col items-center justify-between mt-4">
          <Button type="submit">Submit</Button>
          </div>
        </form>
        </Form>
      </Card>
      {/* <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
       <br />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <br />
        <DatePickerDemo />
        <br />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Gender</option>
          <option key="Male" value="Male">
            Male
          </option>
          <option key="Female" value="Female">
            Female
          </option>
          <option key="Other" value="Other">
            Other
          </option>
        </select>
        <br />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          />
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          />
        <br />
        <input
          type="password"
          name="confirm_password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          />
        <br />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          />
        <br />
        <input
          type="text"
          name="guardian"
          value={formData.guardian}
          onChange={handleChange}
          placeholder="Guardian Name"
          />
        <br />
        <input
          type="text"
          name="guardian_phone"
          value={formData.guardian_phone}
          onChange={handleChange}
          placeholder="Guardian Phone"
          />
        <br />
        <input
          type="text"
          name="health_ins"
          value={formData.health_ins}
          onChange={handleChange}
          placeholder="Health Insurance"
          />
        <br />
        <input
          type="text"
          name="health_ins_number"
          value={formData.health_ins_number}
          onChange={handleChange}
          placeholder="Health Insurance Number"
          />
        <br />
        <select
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          >
          <option value="">Select Grade Level</option>
          {gradeLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Register</button>
      </form> */}
    </div>
  );
}