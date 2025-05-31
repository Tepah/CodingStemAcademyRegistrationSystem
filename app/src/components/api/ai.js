import axios from 'axios';
import config from '@/config';

export const AISubmissionFeedback = async (submissionFile, assignmentFile = null, assignment_id) => {
    const formData = new FormData();
    formData.append('submission_file', submissionFile); 
    if (assignmentFile) {
        formData.append('assignment_file', assignmentFile);
    }
    try {
        const assignmentRes = await axios.get(`${config.backendUrl}/assignment`, { params: { id: assignment_id } });
        const assignment = assignmentRes.data['assignment'];
        formData.append('assignment', JSON.stringify(assignment));

        const response = await axios.post(`${config.backendUrl}/ai/score-suggestion`, formData);
        console.log("AI feedback response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching AI feedback:", error);
        throw error;
    }
}