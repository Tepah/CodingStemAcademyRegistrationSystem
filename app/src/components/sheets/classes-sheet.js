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
  const formRef = React.useRef(null);

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

    const handleFormSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };


  return (
    <Sheet>
      {children}
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Class</SheetTitle>
          <SheetDescription>
            Modify class details and save changes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto pr-4 my-4 mx-2 border rounded-lg">
          <ClassForm classData={classData} semesters={semesters} teachers={teachers} formRef={formRef} />
        </div>
        <SheetFooter className="flex flex-row-reverse justify-between mt-auto pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
