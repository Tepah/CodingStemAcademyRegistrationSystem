"use client";

import React, { useState, useEffect } from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import config from "@/config";

const StudentNamePopover = ({ onSelectStudent, studentsList = null }) => {
    const [students, setStudents] = useState(studentsList);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        console.log("This is student List: ", studentsList);
        console.log("This is students: ", students);
        try {
            const fetchStudents = async () => {
                const response = await axios.get(`${config.backendUrl}/students`);
                setStudents(response.data['students']);
            };
            if (studentsList === null) {
                fetchStudents();
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }, [studentsList, students]);

    const handleSelectStudent = (studentId) => {
        onSelectStudent(studentId);
    };

    const filteredStudents =  students ? students.filter(student => 
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) 
    ) : [];

    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button variant="default">Select Student by Name</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="studentName">Student Name</Label>
                        <Input
                            id="studentName"
                            placeholder="Enter student name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4">
                            {filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                    onClick={() => handleSelectStudent(student.id)}
                                >
                                    <div>{student.first_name} {student.last_name}</div>
                                    <div className="text-sm text-gray-500">{student.email}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default StudentNamePopover;