import axios from 'axios';
import config from "@/config";

export const getUser = async (id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/user`, {
            params: {
                id: id
            }
        });
        console.log(res.data);
        return res.data['user'];
    }
    catch (error) {
        console.error("Error fetching user:", error);
    }
}

export const fetchAssignments = async (class_id, student_id) => {
    try {
        const classRes = await axios.get(`${config.backendUrl}/class/${class_id}`);
        console.log(classRes.data);
        const classData = classRes.data['class'];

        const assignmentRes = await axios.get(`${config.backendUrl}/assignments`, {
            params: {
                class_id: class_id,
            }
        });
        console.log(assignmentRes.data);
        const assignments = assignmentRes.data['assignments'];

        const updatedAssignments = await Promise.all(assignments.map(async (assignment) => {
            const scoreRes = await axios.get(`${config.backendUrl}/scores/${assignment.id}/student/${student_id}`);
            console.log(scoreRes);
            let score = scoreRes.data['score'];

            // If no score exists and the due date has passed, set grade to 0
            const dueDate = new Date(assignment.due_date);
            const today = new Date();
            if (!score && dueDate < today) {
                score = { grade: 0, total_points: assignment.total_points };
            }

            return { ...assignment, score: score };
        }));

        console.log(updatedAssignments);

        // Filter assignments to include only those with due dates that have passed
        const filteredAssignments = updatedAssignments.filter((assignment) => {
            const dueDate = new Date(assignment.due_date);
            const today = new Date();
            return dueDate <= today; // Include only assignments with passed due dates
        });

        // Calculate total points and total score for assignments with passed due dates
        const totalPoints = filteredAssignments.reduce((acc, assignment) => acc + (assignment.total_points || 0), 0);
        const totalScore = filteredAssignments.reduce((acc, assignment) => acc + (assignment.score && assignment.score.grade ? assignment.score.grade : 0), 0);

        return {
            class: classData,
            assignments: updatedAssignments, // Return all assignments, but calculations are based on filtered ones
            totalPoints: totalPoints,
            totalScore: totalScore,
        };
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
};

export const getStudentByName = async (first_name, last_name) => {
    try {
        const res = await axios.get(`${config.backendUrl}/users/by-name`, {
            params: {
                first_name: first_name,
                last_name: last_name
            }
        });
        console.log(res.data);
        return res.data['student'];
    }
    catch (error) {
        console.error("Error fetching student by name:", error);
    }
}

export const getClassesBySemester = async (semester_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/classes/semester`, {
            params: {
                semester_id: semester_id
            }
        });
        console.log(res.data);
        return res.data['classes'];
    }
    catch (error) {
        console.error("Error fetching classes by semester:", error);
    }
}

export const getAllClassesForTeacher = async (id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/all-classes-by-teacher`, {
            params: {
                teacher_id: id
            }
        });
        console.log(res.data);
        return res.data['classes'];
    }
    catch (error) {
        console.error("Error fetching all classes:", error);
    }
};

export const getAssignmentsForStudent = async (student_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/assignments/student`, {
            params: {
                student_id: student_id
            }
        });
        console.log(res.data);
        return res.data['assignments'];
    }
    catch (error) {
        console.error("Error fetching assignments for student:", error);
    }
}


export const getAssignmentsForWeek = async (student_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/assignments/student-week`, {
            params: {
                student_id: student_id
            }
        });
        console.log(res.data);
        return res.data['assignments'];
    }
    catch (error) {
        console.error("Error fetching assignments for week:", error);
    }
}

export const getAssignmentsForTeacher = async (teacher_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/assignments/teacher`, {
            params: {
                teacher_id: teacher_id
            }
        });
        console.log(res.data);
        return res.data['assignments'];
    }
    catch (error) {
        console.error("Error fetching assignments for teacher:", error);
    }
}

export const getAssignmentsForWeekTeacher = async (teacher_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/assignments/teacher-week`, {
            params: {
                teacher_id: teacher_id
            }
        });
        console.log(res.data);
        return res.data['assignments'];
    }
    catch (error) {
        console.error("Error fetching assignments for week:", error);
    }
}

export const getSemesters = async () => {
    try {
        const res = await axios.get(`${config.backendUrl}/semesters`);
        console.log(res.data);
        return res.data['semesters'];
    }
    catch (error) {
        console.error("Error fetching semesters:", error);
    }
}

export const getPaymentsForStudent = async (student_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/payments/student`, {
            params: {
                student_id: student_id
            }
        });
        console.log(res.data);
        return res.data['payments'];
    }
    catch (error) {
        console.error("Error fetching payments for student:", error);
    }
}

export const getAllClassesForStudent = async (id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/all-classes-by-student`, {
            params: {
                student_id: id
            }
        });
        console.log(res.data);
        return res.data['classes'];
    }
    catch (error) {
        console.error("Error fetching all classes:", error);
    }
}

export const getClassesCount = async (user_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/classes-student/count`, {
            params: {
                student_id: user_id
            }
        });
        console.log(res.data);
        return res.data['count'];
    }
    catch (error) {
        console.error("Error fetching classes count:", error);
    }
}

export const getClassesCountForTeacher = async (teacher_id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/classes-teacher/count`, {
            params: {
                teacher_id: teacher_id
            }
        });
        console.log(res.data);
        return res.data['count'];
    }
    catch (error) {
        console.error("Error fetching classes count for teacher:", error);
    }
}

export const getSemester = async (id) => {
    try {
        const res = await axios.get(`${config.backendUrl}/semester`, {
            params: {
                id: id
            }
        });
        console.log(res.data);
        return res.data['semester'];
    }
    catch (error) {
        console.error("Error fetching semester:", error);
    }
}

export const getCurrentSemester = async () => {
    try {
        const res = await axios.get(`${config.backendUrl}/current-semester`);
        console.log(res.data);
        return res.data['semester'];
    }
    catch (error) {
        console.error("Error fetching classes by semester:", error);
    }
}

export const postSemester = async (semester) => {
    try {
        console.log("Creating semester...", semester);
        const response = await axios.post(`${config.backendUrl}/semester`, semester);
        console.log(response.data);
    }
    catch (error) {
        console.error("Error creating semester:", error);
    }
}

export const postTeacherInvite = async (email) => {
    try {
        console.log("Creating teacher invite...", email);
        const response = await axios.post(`${config.backendUrl}/teacher-invite`, {email: email});
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error creating teacher invite:", error);
    }
}

export const verfiyTeacherInvite = async (invite_id) => {
    try {
        console.log("Verifying teacher invite...", invite_id);
        const response = await axios.post(`${config.backendUrl}/verify-teacher-invite`, {
                invite_id: invite_id
            });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error verifying teacher invite:", error);
    }
}

export const updateSemester = async (semester) => {
    try {
        console.log("Updating semester...", semester);
        const response = await axios.put(`${config.backendUrl}/semester`, semester);
        console.log(response.data);
    }
    catch (error) {
        console.error("Error updating semester:", error);
    }
}

export const deleteStudentFromClass = async (class_id, student_id) => {
    try {
        console.log("Deleting student from class...", student_id, class_id);
        const response = await axios.delete(`${config.backendUrl}/delete-student-from-class`, {
            params: {
                student_id: student_id,
                class_id: class_id
            }
        });
        console.log(response.data);
    }
    catch (error) {
        console.error("Error deleting student from class:", error);
    }
}

export const deleteClass = async (class_id) => {
    try {
        console.log("Deleting class...", class_id);
        const response = await axios.delete(`${config.backendUrl}/delete_class/${class_id}`);
        console.log(response.data);
    }
    catch (error) {
        console.error("Error deleting class:", error);
    }
}

export const deletePayment = async (payment_id) => {
    try {
        console.log("Deleting payment...", payment_id);
        const response = await axios.delete(`${config.backendUrl}/payment`, {params: {payment_id: payment_id}});
        console.log(response.data);
    }
    catch (error) {
        console.error("Error deleting payment:", error);
    }
}

export const deleteSemester = async (semester_id) => {
    try {
        console.log("Deleting semester...", semester_id);
        const response = await axios.delete(`${config.backendUrl}/semester`, {params: {semester_id: semester_id}});
        console.log(response.data);
    }
    catch (error) {
        console.error("Error deleting semester:", error);
    }
}