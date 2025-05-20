import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getClassesBySemester } from '@/components/api/api';
import axios from 'axios';
import config from '@/config';


export default function CreateSchedule() {
    const router = useRouter();
    const { semester_id } = router.query;
    const [classes, setClasses] = useState(null);
    const [teachers, setTeachers] = useState(null);

    useEffect(() => {
        if (!semester_id) {
            return;
        }
        console.log("Fetching semester details for ID:", semester_id);
        getClassesBySemester(semester_id)
            .then((classes) => {
                console.log("Classes for semester:", classes);
                setClasses(classes);
            })
            .catch((error) => {
                console.error("Error fetching classes for semester:", error);
            });
        axios.get(`${config.backendUrl}/teachers`)
            .then((response) => {
                console.log("Teachers:", response.data);
                setTeachers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching teachers:", error);
            });
        
    }, [semester_id]);


    return (
        <div className="flex flex-col">
            <DaySchedule day={"Saturday"} classes={classes} teachers={teachers} />
        </div>
    );
}

function DaySchedule({ day, classes, teachers}) {
    const [dayClasses, setDayClasses] = useState([]);

    useEffect(() => {
        if (!classes) return; // Add this check
        const filteredClasses = classes.filter((classItem) => {
            const classDate = new Date(classItem.date);
            return classDate.getDay() === day;
        });
        filteredClasses.sort((a, b) => {
            // Extract hours and minutes from the time strings
            const [hoursA, minutesA] = a.time.split(':').map(Number);
            const [hoursB, minutesB] = b.time.split(':').map(Number);

            // Compare hours first, then minutes
            if (hoursA !== hoursB) {
                return hoursA - hoursB;
            } else {
                return minutesA - minutesB;
            }
        });
        setDayClasses(filteredClasses);
    }, [classes, day]);
    return (
        <div className="flex flex-col">
            <h2 className="text-lg font-bold">{day}</h2>
            
        </div>
    );
}