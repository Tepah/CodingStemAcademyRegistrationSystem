import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import axios from "axios"
import config from "@/config"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ClassForm } from "@/components/forms/class/edit-form"



export function ClassModifySheet({ children, classData }) {
  const [semesters, setSemesters] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);

  const fetchTeachers = async (classesData) => {
    try {
      const res = await axios.get(`${config.backendUrl}/teachers`);
      const teachers = res.data['teachers'];
      setTeachers(teachers);
      console.log("Fetched teachers:", teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    };
  };

  const fetchSemesters = async (classesData) => {
    try {
      const res = await axios.get(`${config.backendUrl}/semesters`);
      const semesters = res.data['semesters'];
      setSemesters(semesters);
      console.log("Fetched semesters:", semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    };
  };

  React.useEffect(() => {
    fetchTeachers();
    fetchSemesters();
  }, []);


  return (
    <Sheet>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit class</SheetTitle>
          <SheetDescription>
            Make changes to the class here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <SheetContent>
          <div className="grid gap-4 p-8">
            <ClassForm classData={classData} semesters={semesters} teachers={teachers} />
          </div>
        </SheetContent>
      </SheetContent>
    </Sheet>
  )
}
