import React, {useEffect, useState} from 'react';
import axios from 'axios';
import config from '../config';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import {getCurrentSemester} from "@/components/api";
import {DataTable} from "@/components/tables/classes/registration/data-table";
import {columns} from "@/components/tables/classes/registration/columns";
import {Button} from "@/components/ui/button";

export default function RegisterClasses() {
  const [classes, setClasses] = useState([]);
  const [currentClasses, setCurrentClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [semester, setSemester] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    const user = jwtDecode(token);
    if (user['sub']['role'] !== 'Student') {
      alert("You are not authorized to access this page");
      return;
    }
    setUser(user['sub']);
  }, []);

  useEffect(() => {
    getCurrentSemester().then(semester => {
      setSemester(semester);
    }).catch(error => {
      console.log(error);
    });
  }, [user]);

  useEffect(() => {
    if (!semester) return;
    if (currentClasses.length > 0) return;
    axios.get(`${config.backendUrl}/student-classes-by-semester`, {params: {semester_id: semester.id, student_id: user.id}})
      .then(response => {
        const classes = response.data['classes'];
        setCurrentClasses(classes);
      })
      .catch(error => {
        console.error("Error fetching current classes:", error);
      });
  }, [semester, currentClasses.length, user.id]);

  useEffect(() => {
    if (!semester) return;
    if (classes.length > 0) return;
    axios.get(`${config.backendUrl}/classes/semester`, {params: {semester_id: semester.id}})
      .then(response => {
        const classes = response.data['classes'];
        Promise.all(
          classes.map(async (classData) => {
            try {
              const teacher = await axios.get(`${config.backendUrl}/user`, {params: {id: classData.teacher_id}});
              return { ...classData, teacher: teacher.data }; 
            } catch (error) {
              console.error("Error fetching teacher:", error);
              return classData; 
            }
          })
        ).then((updatedClasses) => {
          const nonEnrolledClasses = updatedClasses.filter(classData => {
            return !currentClasses.some(currentClass => currentClass.id === classData.id);
          });
          setClasses(nonEnrolledClasses);
        });
      })
      .catch(error => {
        console.error("Error fetching classes:", error);
      });
  }, [currentClasses, classes.length, semester]);

  return (
    <div className="flex flex-col container mx-auto p-8 items-center">
      <h1>Available Classes</h1>
      <DataTable data={classes} columns={columns} />
    </div>
  );
}
