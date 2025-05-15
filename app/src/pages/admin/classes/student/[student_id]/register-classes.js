import React, {useEffect, useState} from 'react';
import axios from 'axios';
import config from '@/config';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import SemesterPicker from '@/components/ClassRegistration/semesterPicker';
import {Layout} from "@/app/layout";
import ClassPicker from '@/components/ClassRegistration/ClassPicker';

export default function RegisterClasses() {
  const [classes, setClasses] = useState([]);
  const [currentClasses, setCurrentClasses] = useState([]);
  const [pickedClasses, setPickedClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const student_id = router.query.student_id;
  const [student, setStudent] = useState(null);
  const [step, setStep] = useState(0);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token)['sub'];
    if (user['role'] !== 'Admin') {
      alert("You are not authorized to access this page");
      return;
    }
    setUser(user);
  }, []);

  if (user && user.role !== 'Admin') {
    return (
      <div className="flex flex-col container mx-auto p-8 items-center">
        <h1>You are not authorized to access this page</h1>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col container max-w-[900px] mx-auto p-8 items-center">
        <h1 className="text-2xl font-bold mb-4">Register Classes for Student</h1>
        {step === 0 && (
          <SemesterPicker setSemester={setSemester} setStep={setStep} loading={loading} setLoading={setLoading} />
        )}
        {step === 1 && (
          <ClassPicker 
            student_id={student_id} 
            semester={semester} 
            loading={loading} 
            setLoading={setLoading} 
            currentClasses={currentClasses} 
            setCurrentClasses={setCurrentClasses}
            pickedClasses={pickedClasses}
            setPickedClasses={setPickedClasses}
            />
        )}
        {step === 2 && (
          <div>
          </div>
        )}
      </div>
    </Layout>
  );
}
