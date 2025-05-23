import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import config from "@/config";
import { Brain, Loader, LoaderCircle, X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { set } from 'date-fns';
import { AISubmissionFeedback } from '../api/ai';


export function SubmissionDialog({ children, submission }) {
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiMode, setAiMode] = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        if (grade === "") {
            setError("Grade cannot be empty");
            return;
        }
        if (isNaN(grade) || grade < 0 || grade > submission.total_points) {
            setError("Grade must be a number between 0 and " + submission.total_points);
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
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                        Input the grade for the submission.
                    </DialogDescription>
                </DialogHeader>
                <div className="min-h-[220px] flex flex-col mt-4 space-y-4">
                    <p className="text-center text-sm text-blue-500 border-2 p-2">
                        {submission.content}
                    </p>
                    {aiMode ? (
                        <div className="flex flex-col space-y-2">
                            <AIComponent submission={submission} assignment_id={submission.assignment_id} setFeedback={setFeedback} setGrade={setGrade} setAiMode={setAiMode} />
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col justify-between space-y-4">
                                <Label htmlFor="grade">
                                    Grade
                                </Label>
                                <div className="flex flex-1 flex-row items-center justify-center space-x-2">
                                    <Input className="w-[100px]" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Enter grade" />
                                    <p>/{submission.total_points}</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between mt-4 space-y-4">
                                <Label htmlFor="feedback">
                                    Feedback <p>(Optional)</p>
                                </Label>
                                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Enter feedback" />
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setAiMode(!aiMode)}>
                        {aiMode ? "Manually Input Feedback" : <>
                            <Brain className="h-4 w-4 mr-2" />
                            AI feedback
                        </>}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button variant="default" onClick={handleConfirm} disabled={grade === ""}>
                        {loading ? "Loading..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AIComponent({ submission, assignment_id, setFeedback, setGrade, setAiMode }) {
    const [aiResponse, setAiResponse] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiGenerated, setAiGenerated] = useState(false);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [fileType, setFileType] = useState("submission");

    const handleAIGenerate = async () => {
        setAiGenerated(true);
        setAiLoading(true);
        try {
            const res = await AISubmissionFeedback(submissionFile, assignmentFile, assignment_id);

            setAiResponse(res);
            setAiLoading(false);
        } catch (error) {
            console.error("Error generating AI feedback:", error);
            setAiResponse({ feedback: "Error generating AI feedback", grade: null });
        }
    }

    const handleSaveResponse = () => {
        if (aiResponse) {
            setGrade(aiResponse.grade);
            setFeedback(aiResponse.feedback);
            setAiGenerated(false);
            setAiResponse(null);
            setAiMode(false);
        }
    }

    return (
        <>
            {!aiGenerated && (
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row justify-between">
                        <Select onValueChange={(value) => setFileType(value)}>
                            <SelectTrigger size="sm">
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="submission">Submission</SelectItem>
                                <SelectItem value="assignment">Assignment</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" variant="default" className="ml-2" disabled={!submissionFile} onClick={() => { handleAIGenerate() }}>
                            Generate AI Feedback
                        </Button>
                    </div>
                    <label htmlFor="file-upload" className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="text-gray-500">
                            <Plus className="w-8 h-8 mx-auto" />
                            <p className="text-sm">Upload file</p>
                        </div>
                        <Input
                            type="file"
                            id="file-upload"
                            accept=".pdf, .docx, .txt, .jpg, .png"
                            onChange={(e) => {
                                if (fileType === "submission") {
                                    setSubmissionFile(e.target.files[0])
                                } else {
                                    setAssignmentFile(e.target.files[0])
                                }
                            }}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </label>
                    {submissionFile && (
                        <div className="flex flex-row justify-between items-center space-x-4">
                            <Label>Submission</Label>
                            <div className="flex flex-row justify-between text-sm text-gray-500 border-2 rounded-md p-2">
                                <p>{submissionFile.name}</p>
                                <X className="h-4 w-4 cursor-pointer" onClick={() => setSubmissionFile(null)} />
                            </div>
                        </div>
                    )}
                    {assignmentFile && (
                        <div className="flex flex-row justify-between items-center space-x-4">
                            <Label>Assignment</Label>
                            <div className="flex flex-row justify-between text-sm text-gray-500 border-2 rounded-md p-2">
                                <p>{assignmentFile.name}</p>
                                <X className="h-4 w-4 cursor-pointer" onClick={() => setAssignmentFile(null)} />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {aiGenerated && (
                <div className="flex flex-col space-y-8">
                    {aiLoading ? (
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-4/5 h-4 rounded-md" />
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="ai-feedback">
                                AI Feedback
                            </Label>
                            <div className="flex flex-col justify-between space-y-4 items-center">
                                <div className="flex flex-row justify-between space-x-4">
                                    <Label>AI Grade</Label>
                                    <div className="flex flex-row max-w-[100px] flex-1 justify-between text-sm text-gray-500 border-2 rounded-md p-2">
                                        <p>{aiResponse.grade} / {submission.total_points}</p>
                                    </div>
                                </div>

                                <Label>AI Feedback</Label>
                                <div className="flex flex-row justify-between text-sm text-gray-500 border-2 rounded-md p-2">
                                    <p>{aiResponse.feedback}</p>
                                    <X className="h-4 w-4 cursor-pointer" onClick={() => setAiResponse(null)} />
                                </div>
                            </div>

                        </div>
                    )}
                    <div className="flex flex-row justify-end ">
                        <Button size="sm" variant="default" className="min-w-[150px]" disabled={!submissionFile} onClick={() => { handleSaveResponse() }}>
                            {aiLoading && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            {!aiLoading && (
                                <p>Use AI Feedback</p>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}