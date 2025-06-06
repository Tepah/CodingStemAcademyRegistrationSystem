import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import SemesterPicker from '@/components/ClassRegistration/semesterPicker';
import {Layout} from "@/app/layout";
import ClassPicker from '@/components/ClassRegistration/ClassPicker';
import Confirmation from '@/components/ClassRegistration/Confirmation';

export default function RegisterClasses() {
  const [currentClasses, setCurrentClasses] = useState([]);
  const [pickedClasses, setPickedClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState(0);

  const router = useRouter();
  const student_id = router.query.student_id;
  const [step, setStep] = useState(0);
  const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Classes', href: '/admin/classes' },
    { name: 'Register Classes', href: `/admin/users/classes/student/${router.query.student_id}/register-classes` }
  ];
  

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
    <Layout breadcrumbs={crumbs}>
      <div className="flex flex-col container max-w-[1300px] mx-auto p-8 items-center">
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
            setStep={setStep}
            setDonations={setDonations}
            />
        )}
        {step === 2 && (
          <Confirmation 
            currentClasses={currentClasses}
            pickedClasses={pickedClasses}
            student_id={student_id}
            setLoading={setLoading}
            loading={loading}
            donations={donations}
          />
        )}
      </div>
    </Layout>
  );
}
