import { Layout } from "@/app/layout";
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { SchedulerProvider } from "@/providers/schedular-provider";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { set, eachDayOfInterval, subMonths, addMonths, format, parseISO } from "date-fns";
import { type } from "os";

export default function Calendar() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    setUser(user['sub']);
  }, []);

  useEffect(() => {
    if (user && user['role'] === 'Student') {
      axios.get(`${config.backendUrl}/events/student`, { params: { student_id: user['id'] } })
        .then((response) => {
          console.log(response.data);
          const classEvents = response.data['classes'].map((event) => {
            const startTime = event['start_time']; // Time string, e.g., "09:00"
            const endTime = event['end_time'];     // Time string, e.g., "10:00"
            const dayOfWeek = event['day']; // Day of the week (string)

            if (!dayOfWeek) {
              console.warn("Event missing dayOfWeek:", event);
              return null; // Skip this event if dayOfWeek is missing
            }

            const twoMonthsAgo = subMonths(new Date(), 2);
            const twoMonthsAhead = addMonths(new Date(), 2);

            const allDays = eachDayOfInterval({
              start: twoMonthsAgo,
              end: twoMonthsAhead,
            }).filter(date => format(date, 'EEEE') === dayOfWeek); // Filter to keep only the specified day of the week

            return allDays.map(date => {
              // Combine date and time
              const startDateTime = set(date, {
                hours: parseInt(startTime.split(':')[0]),
                minutes: parseInt(startTime.split(':')[1]),
                seconds: 0,
              });

              const endDateTime = set(date, {
                hours: parseInt(endTime.split(':')[0]),
                minutes: parseInt(endTime.split(':')[1]),
                seconds: 0,
              });
              console.log("Date:", date);
              console.log("Start Date Time:", startDateTime);
              console.log("End Date Time:", endDateTime);

              return {
                id: event['id'], // Unique ID for each occurrence
                title: event['class_name'],
                startDate: startDateTime,
                endDate: endDateTime,
                variant: "primary",
                color: "blue",
                type: "class",
              };
            });
          }).filter(Boolean).flat();


          const assignmentEvents = response.data['assignments'].map((event) => ({
            id: event['id'],
            title: event['title'],
            startDate: new Date(event['due_date']),
            endDate: new Date(new Date(event['due_date']).getTime()),
            variant: "success",
            type: "assignment",
            class_id: event['class_id'],
          }))
          console.log(classEvents);
          console.log(assignmentEvents);
          setEvents([...classEvents, ...assignmentEvents]);
        })
    } else if (user && user['role'] === 'Teacher') {
      axios.get(`${config.backendUrl}/events/teacher`, { params: { teacher_id: user['id'] } })
        .then((response) => {
          console.log(response.data);
          const classEvents = response.data['classes'].map((event) => {
            const startTime = event['start_time']; // Time string, e.g., "09:00"
            const endTime = event['end_time'];     // Time string, e.g., "10:00"
            const dayOfWeek = event['day']; // Day of the week (string)

            if (!dayOfWeek) {
              console.warn("Event missing dayOfWeek:", event);
              return null; // Skip this event if dayOfWeek is missing
            }

            const twoMonthsAgo = subMonths(new Date(), 2);
            const twoMonthsAhead = addMonths(new Date(), 2);

            const allDays = eachDayOfInterval({
              start: twoMonthsAgo,
              end: twoMonthsAhead,
            }).filter(date => format(date, 'EEEE') === dayOfWeek); // Filter to keep only the specified day of the week

            return allDays.map(date => {
              // Combine date and time
              const startDateTime = set(date, {
                hours: parseInt(startTime.split(':')[0]),
                minutes: parseInt(startTime.split(':')[1]),
                seconds: 0,
              });

              const endDateTime = set(date, {
                hours: parseInt(endTime.split(':')[0]),
                minutes: parseInt(endTime.split(':')[1]),
                seconds: 0,
              });

              return {
                id: `${event['id']}-${format(date, 'yyyyMMdd')}`, // Unique ID for each occurrence
                title: event['class_name'],
                startDate: startDateTime,
                endDate: endDateTime,
                variant: "primary",
                color: "blue",
                type: "class",
              };
            });
          }).filter(Boolean).flat();

          const assignmentEvents = response.data['assignments'].map((event) => ({
            id: event['id'],
            title: event['title'],
            startDate: new Date(event['due_date']),
            endDate: new Date(new Date(event['due_date']).getTime()),
            variant: "success",
            type: "assignment",
          }))
          console.log(classEvents);
          console.log(assignmentEvents);
          setEvents([...classEvents, ...assignmentEvents]);
        })
    } else if (user && user['role'] === 'Admin') {
      axios.get(`${config.backendUrl}/classes`).then((response) => {
        const classEvents = response.data['classes'].map((event) => {
          const startTime = event['start_time']; // Time string, e.g., "09:00"
          const endTime = event['end_time'];     // Time string, e.g., "10:00"
          const dayOfWeek = event['day']; // Day of the week (string)

          if (!dayOfWeek) {
            console.warn("Event missing dayOfWeek:", event);
            return null; // Skip this event if dayOfWeek is missing
          }

          const twoMonthsAgo = subMonths(new Date(), 2);
          const twoMonthsAhead = addMonths(new Date(), 2);

          const allDays = eachDayOfInterval({
            start: twoMonthsAgo,
            end: twoMonthsAhead,
          }).filter(date => format(date, 'EEEE') === dayOfWeek); // Filter to keep only the specified day of the week

          return allDays.map(date => {
            // Combine date and time
            const startDateTime = set(date, {
              hours: parseInt(startTime.split(':')[0]),
              minutes: parseInt(startTime.split(':')[1]),
              seconds: 0,
            });

            const endDateTime = set(date, {
              hours: parseInt(endTime.split(':')[0]),
              minutes: parseInt(endTime.split(':')[1]),
              seconds: 0,
            });

            return {
              id: `${event['id']}-${format(date, 'yyyyMMdd')}`, // Unique ID for each occurrence
              title: event['class_name'],
              startDate: startDateTime,
              endDate: endDateTime,
              variant: "primary",
              color: "blue",
              type: "class",
            };
          });
        }).filter(Boolean).flat();

        setEvents(classEvents);
      })
    }
  }, [user]);

  useEffect(() => {
    if (events) {
      console.log(events);
      setLoading(false);
    }
  }, [events]);

  if (loading) {
    return (
      <Layout title={"Calendar"}>
        <div className="w-[1100px] container flex flex-1 flex-col gap-4 p-8">
          <Card className="w-full h-full">
            <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title={"Calendar"}>
        <div className="w-[1100px]  container flex flex-1 flex-col gap-4 p-8">
          <Card className="w-full h-full">
            <div className="flex items-center justify-center h-full">
              <p>Please log in to view your calendar.</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }



  return (
    <Layout title={"Calendar"}>
      <div className="w-[1100px] container flex flex-1 flex-col gap-4 p-8">
        <SchedulerProvider initialState={events} weekStartsOn="monday">
          <SchedulerWrapper
            stopDayEventSummary={true}
            classNames={{
              tabs: {
                panel: "p-0",
              },
            }}
          />
        </SchedulerProvider>
        </div>
    </Layout>
  );
}
