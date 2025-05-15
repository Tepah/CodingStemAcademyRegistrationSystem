import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';
import config from '@/config';
import { Table, TableCaption, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { DataTable } from '../tables/classes/registration/data-table';
import { columns } from '../tables/classes/registration/columns';


export default function ClassPicker(props) {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        axios.get(`${config.backendUrl}/student-classes-by-semester`, { params: { semester_id: props.semester.id, student_id: props.student_id } })
            .then(response => {
                const classes = response.data['classes'];
                classes.sort((a, b) => {
                    const dayComparison = a.day.localeCompare(b.day);
                    if (dayComparison !== 0) return dayComparison;
                    return a.start_time.localeCompare(b.start_time);
                })
                console.log("Fetched current classes:", classes);
                props.setCurrentClasses(classes);
                props.setPickedClasses(classes);
            })
            .catch(error => {
                console.error("Error fetching current classes:", error);
            });
    }, []);

    const handleAddClass = (classData) => {
        console.log("Adding class:", classData);
        const updatedClasses = [...props.pickedClasses, ...classData];
        updatedClasses.sort((a, b) => {
            console.log(a, b);
            const dayComparison = a.day.localeCompare(b.day);
            if (dayComparison !== 0) return dayComparison;
            return a.start_time.localeCompare(b.start_time);
        })
        props.setPickedClasses(updatedClasses); // Remove the added class from the available classes
    }

    const handleRemoveClass = (classId) => {
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
                            return { ...classData, teacher: teacher.data };
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
    }, [props.pickedClasses]);;


    const handleRegister


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
                                <TableHead className="text-left w-3/4">Class Name</TableHead>
                                <TableHead className="text-left">Day</TableHead>
                                <TableHead className="text-left">Start Time</TableHead>
                                <TableHead className="text-left">End Time</TableHead>
                                <TableHead className="text-left"></TableHead>
                            </TableHeader>
                            <TableBody>
                                {props.pickedClasses.map((classData) => (
                                    <TableRow key={classData.id} className="h-[40px]">
                                        <TableCell className="">{classData.class_name}</TableCell>
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
                        <Button variant="outline" size="sm" onClick={() => props.setOpen(false)}>Cancel</Button>
                        <Button variant="default" size="sm" onClick={() => props.handleSubmit()}>Register</Button>
                    </div>
                </div>
            )}
        </div>
    )
}