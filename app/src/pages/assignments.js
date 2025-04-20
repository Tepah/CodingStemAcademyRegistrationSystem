import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';
import Link from 'next/link';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Get user from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      setUser(decoded.sub); // Make sure sub is a full user object
    } catch (err) {
      console.error("Error decoding token:", err);
      router.push('/');
    }
  }, [router]);

  // Fetch classes for student or teacher
  useEffect(() => {
    if (!user?.id || !user?.role) return;

    const fetchClasses = async () => {
      try {
        let response;
        if (user.role === 'Teacher') {
          response = await axios.get(`${config.backendUrl}/classes/teacher/${user.id}`);
        } else if (user.role === 'Student') {
          response = await axios.get(`${config.backendUrl}/classes/${user.id}`);
        } else {
          throw new Error("Unknown role");
        }

        const classList = response.data.classes || [];
        setClasses(classList.map(c => c.id));
        setAssignments(classList.map(c => ({ classId: c.id, assignments: [] })));
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, [user]);

  // Fetch assignments for each class
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const updatedAssignments = await Promise.all(classes.map(async (classId) => {
          const res = await axios.get(`${config.backendUrl}/assignments`, {
            params: { class_id: classId }
          });
          return { classId, assignments: res.data.assignments || [] };
        }));
        setAssignments(updatedAssignments);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };

    if (classes.length > 0) {
      fetchAssignments();
    }
  }, [classes]);

  return (
    <div>
      <h1>Assignments</h1>
      <br />
      {assignments.map((assignment, index) => (
        <div key={index}>
          <h2>Class ID: {assignment.classId}</h2>
          <ul>
            {assignment.assignments.map((item, i) => (
              <li key={i}>
                <strong>Description:</strong> {item.description} | <strong>Due Date:</strong> {item.due_date}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {user?.role === 'Teacher' && (
        <div>
          <h2>Quick Links</h2>
          <Link href="/create-assignment">Create Assignment</Link>
          <br />
          <Link href="/update-assignment">Update Assignment</Link>
          <br />
          <Link href="/delete-assignment">Delete Assignment</Link>
        </div>
      )}
    </div>
  );
}