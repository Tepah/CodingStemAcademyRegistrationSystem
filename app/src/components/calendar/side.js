"use client";
import React, { useState, useEffect } from 'react';
import { Separator } from '../ui/separator';
import { getAssignmentsForWeek, getAssignmentsForWeekTeacher } from '../api';
import { jwtDecode } from 'jwt-decode';
import { Label } from '@/components/ui/label'
import { isToday, isTomorrow } from 'date-fns';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';


export default function SideCalendar() {
    const [assignments, setAssignments] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwtDecode(token);
            setUser(user['sub']);
        } 
    }, []);

    useEffect(() => {
        if (user && user['role'] === 'Student') {
            getAssignmentsForWeek(user['id']).then((res) => {
                console.log("Fetched Assignments: ", res);
                const temp_assignments = []
                for (const cur of res) {
                    console.log(temp_assignments)
                    if (temp_assignments.length < 1 || temp_assignments.at(-1).at(-1)['due_date'] !== cur['due_date']) {
                        temp_assignments.push([cur])
                    } else if (temp_assignments.at(-1).at(-1)['due_date'] === cur['due_date']) {
                        temp_assignments.at(-1).push(cur)
                    } 
                }
                setAssignments(temp_assignments);
            })
        } else if (user && user['role'] === "Teacher") {
            getAssignmentsForWeekTeacher(user['id']).then((res) => {
                console.log("Fetched Assignments: ", res);
                const temp_assignments = []
                for (const cur of res) {
                    console.log(temp_assignments)
                    if (temp_assignments.length < 1 || temp_assignments.at(-1).at(-1)['due_date'] !== cur['due_date']) {
                        temp_assignments.push([cur])
                    } else if (temp_assignments.at(-1).at(-1)['due_date'] === cur['due_date']) {
                        temp_assignments.at(-1).push(cur)
                    } 
                }
                setAssignments(temp_assignments);
            }).catch((error) => {
                console.error("Error fetching assignments:", error);
            })
        }
    }, [user]);

    return (
        <div className="w-full flex flex-col text-left p-4 pt-8">
            <h1 className="text-lg font-bold mb-4">Upcoming Assignments</h1>
            {assignments.map((assignmentsForDay) => (
                <Day assignments={assignmentsForDay} />
            ))}
            <Link href="/assignments" className="flex flex-row items-center text-sm font-semibold text-muted-foreground hover:cursor-pointer hover:text-primary">
                <Label className="hover:cursor-pointer">View All</Label>
                <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
            </Link>
        </div>
    )
}

function Day({assignments}) {
    const date = new Date(assignments[0]['due_date'])
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = isToday(assignments[0]['due_date']) ? "Today" : isTomorrow(assignments[0]['due_date']) ? "Tomorrow" : daysOfWeek[date.getDay()]
    const day = date.getDate()


    return (
        <div className="w-full flex flex-row text-left">
            <h2 className="text-xl font-semibold items-center">{day}</h2>
            <div className="w-full flex flex-col pt-1 pl-1">
                <Separator />
                <h4 className="text-sm font-semibold">{dayName}</h4>
                <div className="text-sm flex flex-col space-y-2 p-2">
                    {assignments.map((assignment) => (
                        <Link href={`/classes/${assignment['class_id']}/assignments/${assignment['id']}`} className="flex flex-col p-2 rounded-md hover:bg-muted/80">
                            <Label className="hover:cursor-pointer">{assignment['class_name']}</Label>
                            <p className="text-xs">{assignment['title']}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}