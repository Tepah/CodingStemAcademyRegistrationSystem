import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function AddClasses() {
    const [formData, setFormData] = useState({
        teacher_id: '',
        subject: '',
        semester_id: '',
        class_name: '',
        day: '', // added
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${config.backendUrl}/add_class`, formData)
            .then(response => {
                console.log("Successfully added class: " + response.data['message']);
            })
            .catch(error => {
                console.error("Server Error:", error.response?.data || error.message);
            });
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    placeholder="Teacher ID"
                    required
                />
                <br />
                <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleChange}
                    placeholder="Class Name"
                    required
                />
                <br />
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                />
                <br />
                <input
                    type="text"
                    name="semester_id"
                    value={formData.semester_id}
                    onChange={handleChange}
                    placeholder="Semester ID"
                    required
                />
                <br />
                <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>
                <br />
                <button type="submit">Add Class</button>
            </form>
        </div>
    );
}
