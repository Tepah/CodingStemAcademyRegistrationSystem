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
    const [aiClasses, setAiClasses] = useState(null);
    const [teachers, setTeachers] = useState(null);
    const [days, setDays] = useState([])
    const [aiDays, setAiDays] = useState([])
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
                const convertedClasses = classes.map(classItem => ({
                    ...classItem,
                    start_time: convertTo24Hour(classItem.start_time),
                    end_time: convertTo24Hour(classItem.end_time),
                }));
                setClasses(convertedClasses);
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
        const sortedDays = Array.from(uniqueDays).sort((a, b) => {
            const dayOrder = {
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6,
                Sunday: 7,
            };
            return dayOrder[a] - dayOrder[b];
        });
        setDays(sortedDays);
    }, [classes]);

    useEffect(() => {
        if (!aiClasses) return;

        const uniqueDays = new Set(aiClasses.map(classItem => classItem.day));
        const sortedDays = Array.from(uniqueDays).sort((a, b) => {
            const dayOrder = {
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6,
                Sunday: 7,
            };
            return dayOrder[a] - dayOrder[b];
        });
        setAiDays(sortedDays);
    }, [aiClasses]);

    const handleGenerateSchedule = () => {
        setLoading(true);
        setAiGenerated(true);
        const fetchAIScheudle = async () => {
            try {
                const responseClasses = await axios.get(`${config.backendUrl}/classes`);
                let allClasses = responseClasses.data['classes'];

                const updatedAllClasses = await Promise.all(allClasses.map(async (classItem) => {
                    const studentCount = await axios.get(`${config.backendUrl}/student-count`, {params: { class_id: classItem.id } });
                    return {
                        ...classItem,
                        student_count: studentCount.data['student_count'],
                    };
                }));
                allClasses = updatedAllClasses;


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
        fetchAIScheudle();
    }

    const handleSaveSchedule = () => {
        setLoading(true);
        const saveSchedule = async () => {
            try {
                const classesToSave = aiClasses.filter((classItem) => {
                    return !classes.some(existingClass => existingClass.id === classItem.id);
                });
                const response = await axios.post(`${config.backendUrl}/save-semester-schedule`, {
                    classes: classesToSave,
                    semester_id: semester_id,
                });
                console.log("Schedule saved successfully:", response.data);
            } catch (error) {
                console.error("Error saving schedule:", error);
            } finally {
                setLoading(false);
            }
        }
        saveSchedule();
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
                {classes.length === 0 && (
                    <div className="flex items-center text-center justify-center p-8">
                        <span>No classes scheduled..</span>
                    </div>   
                )}
                <div className="flex flex-row gap-4">
                    {days.map((day) => (
                        <DaySchedule key={day} day={day} classes={classes} teachers={teachers} />
                    ))}
                </div>
                {aiGenerated && (
                    <p className="mb-4 mt-4">AI Generated Schedule: </p>
                )}
                {!aiGenerated ? (
                <Button className="mt-4" onClick={handleGenerateSchedule}>
                    <Brain className="mr-2" />
                    Generate Schedule
                </Button>
                ) : (
                <div className="flex flex-row gap-4">
                    {aiDays.map((day) => (
                        <DaySchedule key={day} day={day} classes={aiClasses} teachers={teachers} />
                    ))}
                </div>
                )}
                {aiGenerated && (
                    <Button size="sm" variant="default" onClick={handleSaveSchedule} className="mt-4">
                        <Brain className="h-4 w-4" />
                        Save AI Schedule
                    </Button>
                )}
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
            return (hours >= 9 && hours < 11);
        });
        const elevenToOne = filteredClasses.filter(classItem => {
            const [hours, minutes] = classItem.start_time.split(':').map(Number);
            return (hours >= 11 && hours < 13);
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
            case "Monday": return 0;
            case "Tuesday": return 1;
            case "Wednesday": return 2;
            case "Thursday": return 3;
            case "Friday": return 4;
            case "Saturday": return 5;
            case "Sunday": return 6;
            default: return -1; // Invalid day
        }
    };

    return (
        <div className="flex flex-col min-w-[300px] border rounded-xl p-4 mb-4 shadow-md">
            <h2 className="text-lg font-bold">{day}</h2>

            <ClassSection title="9:00 AM" classes={morningClasses} teachers={teachers} />
            <ClassSection title="11:00 AM" classes={middayClasses} teachers={teachers} />
            <ClassSection title="1:30 PM" classes={afternoonClasses1} teachers={teachers} />
            <ClassSection title="3:30 PM" classes={afternoonClasses2} teachers={teachers} />
            <ClassSection title="5:30 PM" classes={eveningClasses} teachers={teachers} />
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
                <div key={classItem.id} className="flex flex-1 items-center text-center justify-between p-2 border rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                    
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
                    <DialogTitle>{classItem.class_name} ({classItem.id})</DialogTitle>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Subject</label>
                            <span className="text-sm">{classItem.subject}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Teacher</label>
                            <span className="text-sm">{classItem.teacher_name}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Start Time</label>
                            <span className="text-sm">{formatTo12Hour(classItem.start_time)}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">End Time</label>
                            <span className="text-sm">{formatTo12Hour(classItem.end_time)}</span>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function convertTo24Hour(time) {
    if (!time || typeof time !== 'string') {
        return "Invalid Time"; // Handle null, undefined, or non-string inputs
    }

    time = time.trim(); // Remove leading/trailing whitespace

    // Regular expression to match various time formats (e.g., "9:00 AM", "9:00", "09:00", "9 AM")
    const timeRegex = /^(\d{1,2}):(\d{2})?\s*([ap]m)?$/i;
    const match = time.match(timeRegex);

    if (!match) {
        return "Invalid Time"; // Handle invalid time formats
    }

    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2] || '0', 10); // Default to 0 if minutes are missing
    const period = match[3] ? match[3].toLowerCase() : '';

    if (isNaN(hours) || isNaN(minutes)) {
        return "Invalid Time"; // Handle cases where hours or minutes are not numbers
    }

    if (period === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period === 'am' && hours === 12) {
        hours = 0; // Midnight
    }

    hours = hours % 24; // Ensure hours are within 0-23 range

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatTo12Hour(time24) {
    if (!time24 || typeof time24 !== 'string') {
      return "Invalid Time";
    }
  
    const [hours, minutes] = time24.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes)) {
      return "Invalid Time";
    }
  
    const period = hours < 12 ? 'AM' : 'PM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12; // 0 % 12 = 0, so we need to make it 12
  
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }