import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogClose, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import AdminRegisterForm from "@/components/forms/user/admin-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCodeGenerator from "../ui/QRCodeGenerator";

export const RegisterAdminDialog = ({ children }) => {
    const [loading, setLoading] = useState(false);
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
                    Create Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[90vh] lg:max-w-[80vh] h-screen md:h-[90vh] lg:h-[50vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Register Admin</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto min-h-0 px-2">
                    <AdminRegisterForm ref={formRef} setLoading={setLoading} />
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
        </Dialog>
    )
}


