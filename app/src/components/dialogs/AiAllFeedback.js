import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { fetchAssignments } from "../api/api";
import axios from "axios";
import config from "@/config";
import { LoaderCircle } from "lucide-react";
import { set } from "date-fns";
import { jwtDecode } from "jwt-decode";


export default function AiAllFeedback({ children, class_id, student_id }) {
    const [loading, setLoading] = useState(true);
    const [generated, setGenerated] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [student, setStudent] = useState({});
    const [className, setClassName] = useState(null);
    const [saved, setSaved] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        setUser(decodedToken["sub"]);
    }, [])

    useEffect(() => {
        if (!class_id) { return; }

        axios.get(`${config.backendUrl}/feedback-for-class`, { params: { class_id: class_id, user_id: student_id } })
            .then((res) => {
                if (res.data.feedback) {
                    setGenerated(true);
                    setFeedback(res.data.feedback);
                } else {
                    setGenerated(false); // Set generated to false if no feedback exists
                    setFeedback(null);     // Clear any existing feedback
                }
                console.log("Feedback data:", res.data);
            })
            .catch((err) => {
                console.error("Error fetching feedback:", err);
            });
        Promise.all([
            fetchAssignments(class_id, student_id)
                .then((res) => {
                    setAssignments(res.assignments);
                    setClassName(res.class.class_name);
                })
                .catch((err) => {
                    console.error(err);
                }),
            axios.get(`${config.backendUrl}/user`, { params: { id: student_id } })
        ])
            .then(([assignmentsRes, studentRes]) => {
                setStudent(studentRes.data.user);
                console.log("Fetched student:", studentRes.data.user);
            }).finally(() => {
                setLoading(false);
            })
    }, [class_id, student_id]);

    const handleGenerateFeedback = () => {
        setLoading(true);

        axios.post(`${config.backendUrl}/ai/feedback-suggestion`, {
            assignments: assignments,
            className: className,
            student: student
        }).then((res) => {
            setFeedback(res.data.feedback);
            setGenerated(true);
            setLoading(false);
        }).catch((err) => {
            console.error("Error generating feedback:", err);
            setError("Failed to generate feedback. Please try again later.");
            setLoading(false);
        });
    }

    const handleSave = () => {
        setLoading(true);
        Promise.all([
            axios.post(`${config.backendUrl}/feedback`, {
                class_id: class_id,
                user_id: student_id,
                message: feedback.message
            }),
            axios.post(`${config.backendUrl}/messages`, {
                sender_user_id: user.id,
                class_id: class_id,
                receiver_user_id: student_id,
                message: `You have received new feedback for your performance in ${className}. Please check your dashboard for details.`,
                title: `New Feedback for ${className}`,
            })]).then(() => {
                setSaved(true);
                setLoading(false);
            }).catch((err) => {
                console.error("Error saving feedback:", err);
                setError("Failed to save feedback. Please try again later.");
                setLoading(false);
            });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-h-[300px]">
                <DialogHeader>
                    <DialogTitle>Generate AI Feedback</DialogTitle>
                    <DialogDescription>
                        Use AI to generate feedback for your students based on their performance.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {saved && (
                        <div className="p-4 bg-green-100 text-green-800 rounded-md">
                            Feedback saved successfully!
                        </div>
                    )}
                    {!saved && (
                        !generated ? (
                            <div className="flex flex-col justify-center items-center h-full">

                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={handleGenerateFeedback}
                                    disabled={loading}
                                >{loading && (
                                    <LoaderCircle className="animate-spin h-8 w-8" />
                                )}
                                    {loading ? "Generating..." : "Generate Feedback"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-semibold mb-2">Feedback for {student.first_name} {student.last_name} in {className}</h2>
                                <div className="space-y-4 p-4 rounded-md border border-gray-200">
                                    <p>
                                        {feedback.message}
                                    </p>
                                </div>
                                <Button size="sm" variant="default" onClick={handleSave} disabled={loading}>
                                    Save Feedback
                                </Button>
                                <p className="text-sm text-gray-500">(Student will be able to view this feedback in their dashboard)</p>
                            </div>
                        )
                    )}
                </div>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


