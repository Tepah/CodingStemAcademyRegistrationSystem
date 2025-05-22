import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getClassesBySemester } from '@/components/api/api';
import { Layout } from '@/app/layout';
import axios from 'axios';
import config from '@/config';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateSchedule() {
    const router = useRouter();
    const { semester_id } = router.query;
    const [classes, setClasses] = useState(null);
    const [ai_classes, setAiClasses] = useState(null);
    const [teachers, setTeachers] = useState(null);
    const [days, setDays] = useState([])
    const [loading, setLoading] = useState(true);
    const [aiGenerated, setAiGenerated] = useState(false);

    useEffect(() => {
        if (!semester_id) {
            return;
        }
        console.log("Fetching semester details for ID:", semester_id);

        Promise.all([
        getClassesBySemester(semester_id)
            .then((classes) => {
                console.log("Classes for semester:", classes);
                setClasses(classes);
            })
            .catch((error) => {
                console.error("Error fetching classes for semester:", error);
            }),
        axios.get(`${config.backendUrl}/teachers`)
            .then((response) => {
                console.log("Teachers:", response.data);
                setTeachers(response.data['teachers']);
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
            })
        ])
        .then(() => {
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
        );
    }, [semester_id]);

    useEffect(() => {
        if (!classes) return;

        const uniqueDays = new Set(classes.map(classItem => classItem.day));
        setDays(Array.from(uniqueDays));
    }, [classes]);

    const handleGenerateSchedule = () => {
        setLoading(true);
        setAiGenerated(true);
        const fetchAIScheudle = async () => {
            try {
                const responseClasses = await axios.get(`${config.backendUrl}/classes`);
                const allClasses = responseClasses.data['classes'];

                const responseSem = await axios.get(`${config.backendUrl}/semesters`);
                const semesters = responseSem.data['semesters'];


                const response = await axios.post(`${config.backendUrl}/generate-AI-semester-schedule`, {
                    all_classes: allClasses,
                    semesters: semesters,
                    current_semester_id: semester_id,
                    classes: classes,
                    teachers: teachers,
                });
                console.log("AI Generated Schedule:", response.data);
                setAiClasses(response.data['classes']);
            } catch (error) {
                console.error("Error generating AI schedule:", error);
            } finally {
                setLoading(false);
            }
        }

    }

    if (loading) {
        return (
            <Layout>
            <div className="container mx-auto flex flex-col items-center flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Create Schedule</h1>
                <p className="mb-4">Current Schedule: </p>
                <div className="flex flex-row gap-4">
                    <Skeleton className="h-[600px] w-[300px]" />
                    <Skeleton className="h-[600px] w-[300px]" />
                    <Skeleton className="h-[600px] w-[300px]" />
                </div>
                <Button className="mt-4 w-[200px]" disabled>
                    <LoaderCircle className="mr-2 animate-spin" />
                </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto flex flex-col items-center flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Create Schedule</h1>
                <p className="mb-4">Current Schedule: </p>
                <div className="flex flex-row gap-4">
                    {days.map((day) => (
                        <DaySchedule key={day} day={day} classes={classes} teachers={teachers} />
                    ))}
                </div>
                <Button className="mt-4" onClick={handleGenerateSchedule}>
                    <Brain className="mr-2" />
                    Generate Schedule
                </Button>
            </div>
        </Layout>
    );
}

function DaySchedule({ day, classes, teachers }) {
    const [morningClasses, setMorningClasses] = useState([]);
    const [middayClasses, setMiddayClasses] = useState([]);
    const [afternoonClasses1, setAfternoonClasses1] = useState([]);
    const [afternoonClasses2, setAfternoonClasses2] = useState([]);
    const [eveningClasses, setEveningClasses] = useState([]);

    useEffect(() => {
        if (!classes) return;

        const filteredClasses = classes.filter((classItem) => {
            return classItem.day === day;
        });

        const sortClasses = (classesToSort) => {
            return classesToSort.sort((a, b) => {
                const [hoursA, minutesA] = a.start_time.split(':').map(Number);
                const [hoursB, minutesB] = b.start_time.split(':').map(Number);

                if (hoursA !== hoursB) {
                    return hoursA - hoursB;
                } else {
                    return minutesA - minutesB;
                }
            });
        };

        const nineToEleven = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 9 && hours < 11) || (hours === 11 && minutes === 0);
        });
        const elevenToOne = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 11 && hours < 13) || (hours === 13 && minutes === 0);
        });
        const oneThirtyToThreeThirty = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 13 && hours < 15) || (hours === 15 && minutes < 30) || (hours === 13 && minutes >= 30);
        });
        const threeThirtyToFiveThirty = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 15 && hours < 17) || (hours === 17 && minutes < 30) || (hours === 15 && minutes >= 30);
        });
        const fiveThirtyToSevenThirty = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 17 && hours < 19) || (hours === 19 && minutes < 30) || (hours === 17 && minutes >= 30);
        });

        setMorningClasses(sortClasses(nineToEleven));
        setMiddayClasses(sortClasses(elevenToOne));
        setAfternoonClasses1(sortClasses(oneThirtyToThreeThirty));
        setAfternoonClasses2(sortClasses(threeThirtyToFiveThirty));
        setEveningClasses(sortClasses(fiveThirtyToSevenThirty));

    }, [classes, day]);

    const getDayNumber = (dayName) => {
        switch (dayName) {
            case "Sunday": return 0;
            case "Monday": return 1;
            case "Tuesday": return 2;
            case "Wednesday": return 3;
            case "Thursday": return 4;
            case "Friday": return 5;
            case "Saturday": return 6;
            default: return -1; // Invalid day
        }
    };

    return (
        <div className="flex flex-col border rounded-xl p-4 mb-4 shadow-md">
            <h2 className="text-lg font-bold">{day}</h2>

            <ClassSection title="9:00 AM - 10:59 AM" classes={morningClasses} teachers={teachers} />
            <ClassSection title="11:00 AM - 12:59 PM" classes={middayClasses} teachers={teachers} />
            <ClassSection title="1:30 PM - 3:29 PM" classes={afternoonClasses1} teachers={teachers} />
            <ClassSection title="3:30 PM - 5:29 PM" classes={afternoonClasses2} teachers={teachers} />
            <ClassSection title="5:30 PM - 7:29 PM" classes={eveningClasses} teachers={teachers} />
        </div>
    );
}

function ClassSection({ title, classes, teachers }) {

    return (
        <div className="mb-4 ">
            <h3 className="text-md font-semibold">{title}</h3>
            <div className="flex flex-row p-2 h-[100px] overflow-y-auto space-x-2">
            {classes.length === 0 ? (
                <div className="flex flex-1 items-center text-center justify-center p-2">
                    <span>No classes scheduled..</span>
                </div>
            ) : null}
            {classes.map((classItem) => (
                <ClassDialog key={classItem.id} classItem={classItem} teachers={teachers}>
                <div className="flex flex-1 items-center text-center justify-between p-2 border rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                    
                        <span className="text-xs">{classItem.class_name}</span>
                </div>
                </ClassDialog>
            ))}
            </div>
        </div>
    );
}

function ClassDialog({ children, classItem, teachers }) {
    const [selectedTeacher, setSelectedTeacher] = useState(null);


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{classItem.class_name}</DialogTitle>
                    <DialogDescription>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold">Class Name</label>
                                <span className="text-sm">{classItem.class_name}</span>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold">Teacher</label>
                                <span className="text-sm">{classItem.teacher_name}</span>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold">Start Time</label>
                                <span className="text-sm">{classItem.start_time}</span>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold">End Time</label>
                                <span className="text-sm">{classItem.end_time}</span>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}