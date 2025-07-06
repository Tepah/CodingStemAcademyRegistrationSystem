import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/router";
import SemesterPicker from '@/components/ClassRegistration/semesterPicker';
import {Layout} from "@/app/layout";
import ClassPicker from '@/components/ClassRegistration/ClassPicker';
import Confirmation from '@/components/ClassRegistration/Confirmation';
import axios from 'axios';
import config from "@/config";

export default function RegisterClasses() {
  const [currentClasses, setCurrentClasses] = useState([]);
  const [pickedClasses, setPickedClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState(0);
  const [student, setStudent] = useState(null);

  const router = useRouter();
  const student_id = router.query.student_id;
  const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Student Details', href: `/admin/students/${student_id}`},
        { name: `Classes`, href: `/admin/users/classes/student/${student_id}` },
        { name: 'Register Classes', href: `/admin/students/${student_id}/register-classes` }
  ]);
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


    useEffect(() => {
        if (!student_id) return;
        const fetchStudent = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/user`, { params: { id: student_id } });
                console.log("Fetched student:", res.data);
                setStudent(res.data["user"]);
                setCrumbs(prevCrumbs => {
                    if (user['role'] === 'Teacher') {
                        const updatedCrumbs = [];
                        updatedCrumbs.push({ name: 'Home', href: '/dashboard' });
                        updatedCrumbs.push({ name: 'Classes', href: '/classes' });

                        return updatedCrumbs;
                    } else {
                        const updatedCrumbs = [...prevCrumbs];
                        updatedCrumbs[3] = { name: `${res.data['user'].first_name} ${res.data['user'].last_name}`, href: `/admin/students/${student_id}` };

                        return updatedCrumbs;
                    }
                });
                return res.data["user"];
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        }
        if (!user) return;
        fetchStudent().finally((res) => {
            setLoading(false);
        })
    }, [student_id, user]);

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
