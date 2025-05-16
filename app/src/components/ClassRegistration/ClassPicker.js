import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';
import config from '@/config';
import { Table, TableCaption, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { DataTable } from '../tables/classes/registration/data-table';
import { columns } from '../tables/classes/registration/columns';
import { useRouter } from 'next/router';
import { Brain } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


export default function ClassPicker(props) {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const [suggestedClasses, setSuggestedClasses] = useState(null);
    const [dialogLoading, setDialogLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/student-classes-by-semester`, { params: { semester_id: props.semester.id, student_id: props.student_id } });
                const allClasses = response.data['classes'];
                allClasses.sort((a, b) => {
                    const dayComparison = a.day.localeCompare(b.day);
                    if (dayComparison !== 0) return dayComparison;
                    return a.start_time.localeCompare(b.start_time);
                })
                Promise.all(
                    allClasses.map(async (classData) => {
                        try {
                            const teacher = await axios.get(`${config.backendUrl}/user`, { params: { id: classData.teacher_id } });
                            return { ...classData, teacher: teacher.data['user'] };
                        } catch (error) {
                            console.error("Error fetching teacher:", error);
                            return classData;
                        }
                    }
                    )).then((classesWithTeacher) => {
                        console.log("Fetched classes:", classesWithTeacher);
                        props.setCurrentClasses(classesWithTeacher);
                        props.setPickedClasses(classesWithTeacher);
                    });
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses()
            .then(() => { props.setLoading(false); });
    }, []);

    const handleAddClass = (classData) => {
        props.setLoading(true);
        console.log("Adding class:", classData);
        const updatedClasses = [...props.pickedClasses, ...classData];
        updatedClasses.sort((a, b) => {
            console.log(a, b);
            const dayComparison = a.day.localeCompare(b.day);
            if (dayComparison !== 0) return dayComparison;
            return a.start_time.localeCompare(b.start_time);
        })
        props.setPickedClasses(updatedClasses); // Remove the added class from the available classes
        props.setLoading(false);
    }

    const handleRemoveClass = (classId) => {
        props.setLoading(true);
        const updatedPickedClasses = props.pickedClasses.filter(classData => classData.id !== classId);
        props.setPickedClasses(updatedPickedClasses);
        const updatedClasses = [...classes, props.pickedClasses.find(c => c.id === classId)];
        updatedClasses.sort((a, b) => {
            console.log(a, b);
            const dayComparison = a.day.localeCompare(b.day);
            if (dayComparison !== 0) return dayComparison;
            return a.start_time.localeCompare(b.start_time);
        })
        setClasses(updatedClasses); // Add the removed class back to the available classes
        props.setLoading(false);
    }

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/classes/semester`, { params: { semester_id: props.semester.id } });
                const allClasses = response.data['classes'];

                // Filter out classes that are already in currentClasses
                const filteredClasses = allClasses.filter(classData => {
                    return !props.pickedClasses.some(currentClass => currentClass.id === classData.id);
                });

                // Fetch teacher data for the filtered classes
                Promise.all(
                    filteredClasses.map(async (classData) => {
                        try {
                            const teacher = await axios.get(`${config.backendUrl}/user`, { params: { id: classData.teacher_id } });
                            return { ...classData, teacher: teacher.data['user'] };
                        } catch (error) {
                            console.error("Error fetching teacher:", error);
                            return classData;
                        }
                    })
                ).then((classesWithTeacher) => {
                    setClasses(classesWithTeacher); // Set the state with the filtered classes
                    props.setLoading(false);
                });
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchClasses()
            .then(() => { props.setLoading(false); });
    }, [props]);

    const onAIClick = async () => {
        try {
            setDialogLoading(true);
            const resUser = await axios.get(`${config.backendUrl}/user`, { params: { id: props.student_id } })
            const user = resUser.data['user'];
            const resClasses = await axios.get(`${config.backendUrl}/all-classes-by-student`, { params: { student_id: user.id } });
            const prevClasses = resClasses.data['classes'];
            const studentData = {
                student_id: props.student_id,
                previous_classes: prevClasses,
                available_classes: classes,
                current_grade_level: user.grade_level,
            }
            console.log("Student Data: ", studentData);
            const aiRes = await axios.post(`${config.backendUrl}/suggest-schedule`, studentData);
            console.log("AI Response: ", aiRes.data);
            setSuggestedClasses(aiRes.data['schedule']);
            setDialogLoading(false);
        } catch (error) {
            console.error("Error fetching AI classes:", error);
        }
    }

    const validateSchedule = (classes) => {
        for (let i = 0; i < classes.length; i++) {
            for (let j = i + 1; j < classes.length; j++) {
                const class1 = classes[i];
                const class2 = classes[j];

                if (class1.day === class2.day) {
                    // Convert start and end times to comparable values (e.g., minutes from start of day)
                    const startTime1 = timeToMinutes(class1.start_time);
                    const endTime1 = timeToMinutes(class1.end_time);
                    const startTime2 = timeToMinutes(class2.start_time);
                    const endTime2 = timeToMinutes(class2.end_time);

                    console.log("startTime1", startTime1);
                    console.log("endTime1", endTime1);
                    console.log("startTime2", startTime2);
                    console.log("endTime2", endTime2);

                    if ((startTime1 <= endTime2) && (endTime1 >= startTime2)) {
                        setError(`Time conflict between ${class1.class_name} and ${class2.class_name} on ${class1.day}`);
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const timeToMinutes = (timeString) => {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');
        let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

        if (period === 'PM' && hours !== '12') {
            totalMinutes += 12 * 60;
        }
        if (period === 'AM' && hours === '12') {
            totalMinutes = 0; // Midnight
        }

        return totalMinutes;
    };



    const handleRegister = () => {
        setError(null);
        if (props.pickedClasses.length === 0) {
            setError("Please select at least one class to register");
            return;
        }

        if (!validateSchedule(props.pickedClasses)) {
            return;
        }
        props.setLoading(true);
        props.setStep(2);
    }


    return (
        <div className="w-full flex flex-col space-y-4 p-4">
            {props.loading ? (
                <>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </>
            ) : (
                <div className="flex flex-col space-y-4">
                    <DataTable data={classes} columns={columns} onClick={(classData) => handleAddClass(classData)} />
                    <Card className="p-4">
                        <Table>
                            <TableCaption>Classes Currently Taking</TableCaption>
                            <TableHeader>
                                <TableHead className="text-left w-1/2">Class Name</TableHead>
                                <TableHead className="text-left w-1/5">Teacher</TableHead>
                                <TableHead className="text-left">Day</TableHead>
                                <TableHead className="text-left">Start Time</TableHead>
                                <TableHead className="text-left">End Time</TableHead>
                                <TableHead className="text-left"></TableHead>
                            </TableHeader>
                            <TableBody>
                                {props.pickedClasses.map((classData) => (
                                    <TableRow key={classData.id} className="h-[40px]">
                                        <TableCell className="">{classData.class_name}</TableCell>
                                        <TableCell className="">{classData.teacher.first_name} {classData.teacher.last_name}</TableCell>
                                        <TableCell>{classData.day}</TableCell>
                                        <TableCell>{classData.start_time}</TableCell>
                                        <TableCell>{classData.end_time}</TableCell>
                                        <TableCell><Button size="sm" variant="outline" onClick={() => handleRemoveClass(classData.id)}>Remove</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                    <div className="flex flex-row justify-between">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/classes/student/${props.student_id}`)}>Cancel</Button>
                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex flex-row space-x-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                        <Brain />
                                        AI Suggested Schedule
                                    </Button>
                                </DialogTrigger>
                                {dialogLoading ? (
                                    <DialogContent className="flex flex-col space-y-4 p-4">
                                        <Skeleton className="h-8 w-1/2" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </DialogContent>
                                ) : !suggestedClasses ? (
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>AI Suggested Schedule</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col space-y-4">
                                            <Button variant="default" size="sm" onClick={() => onAIClick()}>Get AI Suggested Schedule</Button>
                                        </div>
                                    </DialogContent>
                                ) : (
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>AI Suggested Schedule</DialogTitle>
                                        </DialogHeader>
                                        <Table>
                                            <TableCaption>Classes Suggested by AI</TableCaption>
                                            <TableHeader>
                                                <TableHead className="text-left w-1/2">Class Name</TableHead>
                                                <TableHead className="text-left w-1/5">Teacher</TableHead>
                                                <TableHead className="text-left">Day</TableHead>
                                                <TableHead className="text-left">Start Time</TableHead>
                                                <TableHead className="text-left">End Time</TableHead>
                                            </TableHeader>
                                            <TableBody>
                                                {suggestedClasses.map((classData) => (
                                                    <TableRow key={classData.id} className="h-[40px]">
                                                        <TableCell className="">{classData.class_name}</TableCell>
                                                        <TableCell className="">{classData.teacher.first_name} {classData.teacher.last_name}</TableCell>
                                                        <TableCell>{classData.day}</TableCell>
                                                        <TableCell>{classData.start_time}</TableCell>
                                                        <TableCell>{classData.end_time}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <div className="flex flex-col space-y-4">
                                            <Button variant="default" size="sm" onClick={() => handleAddClass(suggestedClasses)}>Add Suggested Classes</Button>
                                        </div>
                                    </DialogContent>
                                )
                                }
                            </Dialog>
                            <Button variant="default" size="sm" onClick={() => handleRegister()}>Register</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}