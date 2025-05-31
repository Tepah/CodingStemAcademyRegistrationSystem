import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns" // Import parse
import { SheetFooter } from "@/components/ui/sheet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from "axios";
import config from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";


const studentSchema = z.object({
  id: z.number().int(),
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
  health_ins_num: z.string().min(1, {
    message: "Health insurance number is required",
  }),
  role: z.enum(["Student", "Admin", "Teacher"]),
  grade_level: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]),
});

export default function EditStudentForm({ student }) {
  const gradeLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: student
  })

  const handleSubmit = (data) => {
    data.birth_date = format(new Date(`${data.birth_date.year}-${data.birth_date.month}-${data.birth_date.day}`), 'yyyy-MM-dd');
    delete data.confirm_password;

    axios.put(`${config.backendUrl}/users/update`, data)
    .then((response) => {
    console.log("Form submitted successfully:", data);
    window.location.reload();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollArea className="h-4/5 w-full py-4 px-2 border rounded">
          <div className="space-y-8">
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
                  </div>
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
              name="health_ins_num"
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
        </ScrollArea>


        <SheetFooter>
          <Button type="submit">Save Changes</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}