import { useRouter } from 'next/router';
import { Layout } from "@/app/layout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/tables/submissions/data-table";
import { columns } from "@/components/tables/submissions/columns";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SubmissionForm } from '@/components/forms/submission/form';
import ManualScoreDialog from '@/components/dialogs/manualScoreDialog';
import { Skeleton } from '@/components/ui/skeleton';

const ClassPage = () => {
  const router = useRouter();
  const { assignment_id, class_id } = router.query; // Access the dynamic ID from the URL
  const [assignmentData, setAssignmentData] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/').then(() => { console.log("Returning logged out user to main") })
    }
    const user = jwtDecode(token);
    setUser(user['sub']);
  }, [router]);

  useEffect(() => {
    // Fetch assignment information here using Axios 
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/assignment`, {
          params: { id: assignment_id },
        });
        setAssignmentData(response.data.assignment);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/assignments-submissions`, {
          params: { assignment_id },
        });
        return response.data.submissions;
      } catch (error) {
        console.error("Error fetching submissions:", error);
        return []; // Return an empty array in case of error
      }
    }

    const fetchStudents = async (submissionsData) => {
      try {
        const submissionsWithStudentNames = await Promise.all(submissionsData.map(async (submission) => {
          const response = await axios.get(`${config.backendUrl}/user`, {
            params: { id: submission.student_id },
          });
          const student = response.data.user;
          submission.student_name = `${student.first_name} ${student.last_name}`;
          return submission;
        }));
        return submissionsWithStudentNames;
      } catch (error) {
        console.error("Error fetching students:", error);
        return submissionsData; // Return original submissions in case of error
      }
    }

    const fetchScores = async (submissionsData) => {
      try {
        console.log("Fetching scores for submissions:", submissionsData);
        const submissionsWithScores = await Promise.all(submissionsData.map(async (submission) => {
          try {
            const response = await axios.get(`${config.backendUrl}/score`, { params: { submission_id: submission.id } });
            const score = response.data.score;
            submission.grade = score ? score.grade : null; // Handle cases where score is null
            submission.feedback = score ? score.feedback : null; // Handle cases where feedback is null
            submission.score_id = score ? score.id : null; // Handle cases where score_id is null
          } catch (error) {
            console.error(`Error fetching score for submission ${submission.id}:`, error);
            submission.grade = 0; // Set grade to null in case of error
          }
          return submission;
        }));
        return submissionsWithScores;
      } catch (error) {
        console.error("Error fetching scores:", error);
        return submissionsData; // Return submissions without scores in case of error
      }
    }

    if (assignment_id) {
      setLoading(true); // Start loading
      fetchAssignment();
      fetchSubmissions()
        .then((submissions) => fetchStudents(submissions))
        .then((submissionsWithStudentNames) => fetchScores(submissionsWithStudentNames))
        .then((submissionsWithScores) => {
          console.log("Final submissions with scores:", submissionsWithScores);
          setSubmissions(submissionsWithScores);
        })
        .catch((error) => {
          console.error("Error in data fetching pipeline:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  }, [assignment_id])

  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-[900px] container p-8 flex-1 flex flex-col mx-auto space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-[900px] container p-8 flex-1 flex flex-col mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Assignment Details</h1>
          {user && user.role === "Student" && (
            <div className="flex justify-end">
              <Popover>
                <PopoverTrigger><Button type="default">Make Submission</Button></PopoverTrigger>
                <PopoverContent>
                  <SubmissionForm assignment_id={assignment_id} user_id={user.id} />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <h2 className="text-xl font-semibold">{assignmentData.title}</h2>
            <div className="flex flex-row items-center justify-end space-x-4">
              <h3 className="text-lg font-semibold">Due Date: </h3>
              <p className="">{new Date(assignmentData.due_date).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="">{assignmentData.description}</p>
        </Card>
        {user && user.role === "Teacher" && (
          <div className="flex flex-col my-8">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold">Submissions</h2>
              <ManualScoreDialog assignment_id={assignment_id} class_id={class_id} submissions={submissions} />
            </div>
            <DataTable columns={columns} data={submissions} />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ClassPage;
