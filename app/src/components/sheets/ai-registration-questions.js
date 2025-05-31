"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "../ui/input"
import { SendHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import React, { useEffect, useState } from "react"
import axios from "axios"
import config from "@/config"
import { Skeleton } from "../ui/skeleton"


export default function AIRegistrationQuestions({ children }) {
    const [question, setQuestion] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [chat, setChat] = useState([]);
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const callAI = async (question) => {
        try {
            setChat((prev) => [...prev, question]);
            setQuestion("");
            setOrder((prev) => [...prev, "Q"]);

            const updatedQuestions = await new Promise((resolve) => {
                setQuestions((prevQuestions) => {
                    const updated = [...prevQuestions, question];
                    resolve(updated); 
                    return updated;
                });
            });

            const response = await axios.post(`${config.backendUrl}/ai`, { questions: updatedQuestions, answers });
            const answer = response.data['suggestions'];
            console.log("AI Response:", response.data['suggestions']);
            setAnswers((prev) => [...prev, answer]);
            setChat((prev) => [...prev, answer]);
            setOrder((prev) => [...prev, "A"]);
            setIsLoading(false);
        } catch (error) {
            console.error("Error calling AI:", error);
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>AI Registration Questions</SheetTitle>
                    <SheetDescription>
                        Ask any question related to registration and get instant answers.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-2">
                    {order.map((item, index) => (
                        <div key={index} className={`flex ${item === "Q" ? "justify-end ml-8" : "justify-start mr-8"} items-center`}>
                            <div className={`p-2 rounded-lg ${item === "Q" ? "bg-blue-100" : "bg-green-100"} max-w-md`}>
                                {chat[index]}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <Skeleton className="h-10 w-4/5 justify-start" />
                    )}
                </div>
                <SheetFooter>
                    <div className="flex flex-row flex-1 justify-between gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Ask a question..."
                            className="w-full"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                    callAI(question);
                                    setQuestion("");
                                    setIsLoading(true);
                                }
                            }}
                        />
                        <Button onClick={() => { callAI(question); setQuestion(""); setIsLoading(true); }} disabled={isLoading}>
                            <SendHorizontal className="h-8 w-8 text-white cursor-pointer" />
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}