import React, { useEffect, useState } from "react";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { postTeacherInvite } from "../api/api";
import QRCodeGenerator from "../ui/QRCodeGenerator";

export const TeacherLink = ({ children, teacherData }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState(null);

    const handleCreateLink = async () => {
        setLoading(true);
        postTeacherInvite(email).then((response) => {
            console.log(response);
            const baseUrl = window.location.origin;
            setLink(`${baseUrl}/register-teacher?token=${response['invite_id']}`);
            setLoading(false);
        }).catch((error) => {
            console.error("Error creating teacher invite:", error);
            setLoading(false);
        });
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="">
                    Create Teacher link
                </Button>
            </DialogTrigger>
            {loading ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Creating Teacher Link</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p className="text-center text-sm p-2">
                            Creating a link for the teacher to sign up. Please wait...
                        </p>
                    </div>
                </DialogContent>
            ) : link ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Teacher Link</DialogTitle>
                        <DialogDescription>
                            Copy and Paste the link below to send to the teacher to sign up.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-4 items-center">
                        <QRCodeGenerator text={link} />
                        <span className="p-8 background-gray-300">
                            <p className="text-center text-sm p-2">
                                {link}
                            </p>
                        </span>
                    </div>
                </DialogContent>
            ) : (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Teacher Link</DialogTitle>
                    <DialogDescription>
                        Create a Link for a teacher to use to sign up for the system.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateLink}>Create Link</Button>
                </DialogFooter>
            </DialogContent>
            )}
        </Dialog>
    )
}


