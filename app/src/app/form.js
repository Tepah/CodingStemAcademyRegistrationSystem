"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    guardian: "",
    guardian_phone: "",
    health_ins: "",
    health_ins_num: "",
    role: "",
    grade_level: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Handle form submission logic here (e.g., API call)
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-10 p-5">
      <CardHeader>
        <CardTitle>Student Registration Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="first_name" placeholder="First Name" onChange={handleChange} required />
            <Input name="last_name" placeholder="Last Name" onChange={handleChange} required />
          </div>
          <Input type="date" name="birth_date" onChange={handleChange} required />
          <Input name="gender" placeholder="Gender" onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <Input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <Input name="address" placeholder="Address" onChange={handleChange} required />
          <Input name="guardian" placeholder="Guardian Name" onChange={handleChange} required />
          <Input type="tel" name="guardian_phone" placeholder="Guardian Phone" onChange={handleChange} required />
          <Input name="health_ins" placeholder="Health Insurance" onChange={handleChange} required />
          <Input name="health_ins_num" placeholder="Health Insurance Number" onChange={handleChange} required />
          <Input name="role" placeholder="Role" onChange={handleChange} required />
          <Input type="number" name="grade_level" placeholder="Grade Level" onChange={handleChange} />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
