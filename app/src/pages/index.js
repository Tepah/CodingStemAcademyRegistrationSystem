import Link from "next/link";
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import AIRegistrationQuestions from "@/components/sheets/ai-registration-questions";
import { SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function Home() {


  useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log("Token found in local storage");
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className={"flex items-center justify-center h-screen"}>

      <AIRegistrationQuestions>
        <Card className={"relative w-[350px]"}>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl">Stem Action Teen Institution</CardTitle>
            <CardDescription>
              Where learning meets innovation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-row gap-4 justify-center"}>
              <Button asChild>
                <Link href={"/login"}>Login</Link>
              </Button>
              <span>or</span>
              <Button asChild>
                <Link href={"/register"}>Register</Link>
              </Button>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <div className="absolute -top-12 -right-12 transform hover:scale-110 transition-transform hover:cursor-pointer">
                    <MessageCircleQuestion className="h-12 w-12" />
                  </div>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Need help? Click here to ask questions about registration.</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </AIRegistrationQuestions>
    </div>
  );
}
