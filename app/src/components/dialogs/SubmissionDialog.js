import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import config from "@/config";


export function SubmissionDialog({ children, submission }) {
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        if (grade === "") {
            setError("Grade cannot be empty");
            return;
        }
        if (isNaN(grade) || grade < 0 || grade > 100) {
            setError("Grade must be a number between 0 and 100");
            return;
        }
        setError("");
        const data = {
            assignment_id: submission.assignment_id,
            submission_id: submission.id,
            grade: grade,
            feedback: feedback,
            student_id: submission.student_id,
        }

        axios.post(`${config.backendUrl}/score`, data)
        .then((response) => {
            console.log("Submission graded successfully", response.data);
            window.location.reload();
        }).catch((error) => {
            console.error("Error grading submission:", error);
            setError("Error grading submission: " + error.response.data.message);
        })
        .finally(() => {
            setLoading(false);
        });
      }

    return (
        <Dialog>
            {children}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                        Input the grade for the submission.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col mt-4 space-y-4">
                    <p className="text-center text-sm text-blue-500">
                        {submission.content}
                    </p>
                    <div className="flex flex-row justify-between space-x-8">
                        <Label htmlFor="grade">
                            Grade
                        </Label>
                        <div className="flex flex-1 flex-row items-center justify-center space-x-2">
                            <Input className="w-[100px]" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Enter grade" />
                            <p>/100</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between mt-4 space-y-2">
                        <Label htmlFor="feedback">
                            Feedback <p>(Optional)</p>
                        </Label>
                        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Enter feedback" />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button variant="default" onClick={handleConfirm}>
                        {loading ? "Loading..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
