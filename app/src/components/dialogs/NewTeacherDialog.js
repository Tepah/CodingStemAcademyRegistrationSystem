import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogClose, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import RegisterTeacherForm from "@/components/forms/user/teacher-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCodeGenerator from "../ui/QRCodeGenerator";

export const RegisterTeacherDialog = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState(null);
    const formRef = useRef(null);

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="">
                    Create Teacher
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[90vh] lg:max-w-[80vh] h-screen md:h-[90vh] lg:h-[50vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Register Teacher</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto min-h-0 px-2">
                    <RegisterTeacherForm ref={formRef} setLoading={setLoading} />
                </div>
                <DialogFooter>
                    <div className="flex flex-row-reverse gap-4 mt-auto">
                        <Button size="sm" variant="outline" onClick={() => setLink(null)}>
                            <DialogClose>Cancel</DialogClose>
                        </Button>
                        <Button size="sm" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Register"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
            {/*{loading ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Creating Teacher</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p className="text-center text-sm p-2">

                        </p>
                    </div>
                </DialogContent>
            ) : link ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
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
            )} */}
        </Dialog>
    )
}


