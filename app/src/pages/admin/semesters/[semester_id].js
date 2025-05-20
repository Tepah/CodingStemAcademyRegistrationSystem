import React, { useEffect, useState } from "react";
import { Layout } from "@/app/layout";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { getClassesBySemester, getSemester }  from "@/components/api/api";
import { DataTable } from "@/components/tables/classes/semester/data-table";
import { columns } from "@/components/tables/classes/semester/columns";
import { Button } from "@/components/ui/button";

export default function SemesterPage() {
    const router = useRouter();
    const { semester_id } = router.query;
    const [semester, setSemester] = useState(null);
    const [classes, setClasses] = useState(null);
    const startDate = new Date(semester?.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const endDate = new Date(semester?.end_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    useEffect(() => {
        if (!semester_id) {
            return;
        }
        console.log("Fetching semester details for ID:", semester_id);
        getSemester(semester_id)
            .then((semester) => {
                console.log("Semester details:", semester);
                setSemester(semester);
            })
            .catch((error) => {
                console.error("Error fetching semester details:", error);
            });
    }, [semester_id]);

    useEffect(() => {
        if (semester) {
            getClassesBySemester(semester.id)
                .then((classes) => {
                    console.log("Classes for semester:", classes);
                    setClasses(classes);
                })
                .catch((error) => {
                    console.error("Error fetching classes for semester:", error);
                });
        }
    }, [semester]);

    if (!semester || !classes) {
        return (
            <Layout>
                <div className="flex flex-col container p-8">
                    <Label className="text-2xl font-bold">Loading...</Label>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col container mx-auto max-w-[1000px] p-8">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-4">
                    <Label className="text-2xl font-bold">{semester.name}</Label>
                    <p>{startDate} - {endDate}</p>
                </div>
                <Button size="sm" variant="default" onClick={() => router.push(`/admin/semesters/${semester.id}/createSchedule`)}>
                    Create Schedule
                </Button>
                </div>
                <DataTable columns={columns} data={classes} />
            </div>
        </Layout>
    )
}