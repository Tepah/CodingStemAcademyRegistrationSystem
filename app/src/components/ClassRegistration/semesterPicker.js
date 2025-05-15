import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import config from '@/config';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../ui/table';
import { Skeleton } from '../ui/skeleton';



export default function SemesterPicker(props) {
    const [semesters, setSemesters] = useState(null);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/semesters/ongoing-or-upcoming`);
                setSemesters(response.data['semesters']);
            } catch (error) {
                console.error("Error fetching semesters:", error);
            }
        };

        fetchSemesters()
        .then(() => {
            console.log("Fetched semesters:", semesters);
            props.setLoading(false);
        })
    }, []);

    
    return (
        <Card className="w-full flex flex-col p-8">
            {props.loading ? (
                <>
                    <Label className="text-2xl font-bold mb-4">Loading Semesters...</Label>
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                </>
            ) : (
                <div className="flex flex-col"><Label className="text-2xl font-bold mb-4">Select a Semester</Label>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Semester</TableHead>
                                <TableHead className="text-left">Start Date</TableHead>
                                <TableHead className="text-left">End Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        {semesters.length > 0 ? (
                            semesters.map((semester) => (
                                <TableRow key={semester.id} className="hover:cursor-pointer h-[60px]" onClick={() => {
                                    props.setSemester(semester);
                                    props.setStep(1);
                                    props.setLoading(true);
                                }}>
                                    <TableCell className="w-3/4">{semester.name}</TableCell>
                                    <TableCell>{new Date(semester.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(semester.end_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <p>No semesters available.</p>
                        )}
                    </Table>
                    </div>
            )}
        </Card>
    )
};