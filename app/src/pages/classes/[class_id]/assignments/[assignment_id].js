import { useRouter } from 'next/router';
import { Layout } from "@/components/layout/Layout";
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
import { Separator } from '@/components/ui/separator';
import AssignmentModifySheet from '@/components/sheets/assignment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const ClassPage = () => {
  const router = useRouter();
  const { assignment_id, class_id } = router.query; // Access the dynamic ID from the URL
  const [assignmentData, setAssignmentData] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [crumbs, setCrumbs] = useState([
    { name: 'Home', href: '/dashboard' },
    { name: 'Classes', href: '/classes' },
    { name: 'Class', href: `/classes/${class_id}` },
    { name: 'Assignments', href: `/classes/${class_id}/assignments` },
    { name: 'Assignment', href: `/classes/${class_id}/assignments/${assignment_id}` },
  ]);

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
        setCrumbs(prev => {
          const updatedCrumbs = [...prev];
          updatedCrumbs[4] = { name: response.data.assignment.title, href: `/classes/${class_id}/assignments/${assignment_id}` };
          return updatedCrumbs;
        });
      } catch (error) {
        console.error("Error fetching assignment data:", error);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/assignments-submissions`, {
          params: { assignment_id },
        });
        console.log("Fetched submissions:", response.data.submissions);
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
      if (user.role === "Teacher" || user.role === "Admin") {
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
      } else if (user.role === "Student") {
        setLoading(false);
      }
    }
    if (class_id) {
      axios.get(`${config.backendUrl}/class`, { params: { id: class_id } })
        .then((response) => {
          setCrumbs(prev => {
            const updatedCrumbs = [...prev];
            updatedCrumbs[2] = { name: response.data.class.class_name, href: `/classes/${class_id}` };
            return updatedCrumbs;
          });
        });
    }
  }, [assignment_id, class_id, user.role]);


  if (loading) {
    return (
      <Layout breadcrumbs={crumbs} title="Assignment Details">
        <div className="max-w-[900px] container p-8 flex-1 flex flex-col mx-auto space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout breadcrumbs={crumbs} title="Assignment Details">
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
          {user && (user.role === "Teacher" || user.role === "Admin") && (
            <div className="flex flex-row justify-end gap-4">
              <DeleteDialog assignment={assignmentData}>
                <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">Delete Assignment</Button>
                </AlertDialogTrigger>
              </DeleteDialog>
              <AssignmentModifySheet assignmentData={assignmentData}>
                <Button size="sm" type="default">Edit Assignment</Button>
              </AssignmentModifySheet>
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
        {user && (user.role === "Teacher" || user.role === "Admin") && (
          <div className="flex flex-col my-8">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold">Submissions</h2>
              <ManualScoreDialog assignment_id={assignment_id} class_id={class_id} submissions={submissions} />
            </div>
            <DataTable columns={columns} data={submissions} />
          </div>
        )}
        {user && user.role === "Student" && (
          <div className="flex flex-col my-8">
            <SubmissionInformation student_id={user['id']} assignmentData={assignmentData} />
          </div>
        )}
      </div>
    </Layout>
  );
};

const SubmissionInformation = ({ student_id, assignmentData }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.backendUrl}/submissions/student`, {
      params: { student_id, assignment_id: assignmentData.id }
    })
      .then((res) => {
        console.log("Fetched submissions:", res.data.submissions);
        const fetchScores = async (submissions) => {
          const submissionsWithScores = await Promise.all(submissions.map(async (submission) => {
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
        }
        fetchScores(res.data.submissions).then((submissionsWithScores) => {
          console.log("Final submissions with scores:", submissionsWithScores);
          setSubmissions(submissionsWithScores);
        });
      }
      ).catch((error) => {
        console.error('Error fetching submissions:', error);
      }).finally(() => {
        setLoading(false);
      });

  }, [student_id, assignmentData.id]);

  return (
    <>
      {submissions.length !== 0 && (
        <div className="container max-w-[900px] flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Your Submissions</h1>
          <Card className="p-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-[120px] w-full" />
                <Separator className="my-4" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex flex-col flex gap-4 p-4">
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col justify-between gap-2">
                        <p className="">Grade: {submission.grade !== null ? submission.grade : "N/A"} / {assignmentData.total_points}</p><p className="text-sm text-gray-500">Feedback:</p>
                        <p className="text-sm text-gray-500">{submission.feedback !== null ? submission.feedback : "Not Graded"}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-500">
                          {new Date(submission.submission_date).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZone: 'UTC'
                          })}</p>
                      </div>
                    </div>
                    <h2 className="">Submission: </h2>
                    <div className="border border-gray-300 p-4">
                      <h2 className="text-center justify-center">{submission.content}</h2>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

function DeleteDialog({ children, assignment }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.backendUrl}/assignment`, { params: { id: assignment.id } });
      router.push(`/classes/${assignment.class_id}/assignments`);
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Assignment and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default ClassPage;
