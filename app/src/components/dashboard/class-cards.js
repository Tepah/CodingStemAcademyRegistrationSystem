import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { Label } from '../ui/label';
import { BookCopy, CircleAlert, Megaphone, NotepadText } from 'lucide-react';
import { Separator } from '../ui/separator';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import config from '@/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const ClassCard = ({ classData }) => {
    console.log(classData);
    const [unread, setUnread] = useState(0);
    const class_id = classData['id']

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = jwtDecode(token)['sub'];
                const res = await axios.get(`${config.backendUrl}/class-messages/unread`, { params: { class_id: class_id, user_id: user['id'] } });
                console.log(res.data);
                setUnread(res.data['count']);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
        fetchMessages();
    }, [class_id]);

    console.log(unread);

    return (
        <Card className="col-span-1 flex-1 flex flex-col hover:scale-105 transition-transofrm duration-200 ease-in-out">
            <CardHeader>
                <div className="w-full flex flex-1 justify-between">
                    <div className="text-left">
                        <CardTitle className="h-[20px] w-[100px] truncate">{classData.class_name}</CardTitle>
                        <Label className="text-xs">{classData.subject}</Label>
                        <Label className="text-xs">
                            {classData.teacher ? (
                                <>
                                    {classData.teacher.gender === 'Male' ? 'Mr.' : 'Ms.'} {classData.teacher['first_name']}
                                </>
                            ) : (
                                "N/A"
                            )}
                        </Label>
                    </div>
                    <div className="">
                        <Label className="text-xs">
                            {classData.day}
                        </Label>
                        <Label className="text-xs">
                            {classData.start_time}
                        </Label>
                        <Label className="text-xs">
                            {classData.end_time}
                        </Label>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="w-full py-3 flex flex-row justify-evenly items-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/classes/${classData.id}`} className="text-center">
                            <BookCopy className="w-[25px] h-[25px] hover:scale-105" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Class</p>
                    </TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="h-[25px]" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/classes/${classData.id}/assignments`} className="text-center">
                            <NotepadText className="w-[25px] h-[25px] hover:scale-105" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Assignments</p>
                    </TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="h-[25px]" />
                <Tooltip>
                    <TooltipTrigger asChild>

                        <Link href={`/classes/${classData.id}/announcements`} className="text-center relative">
                            <Megaphone className="w-[25px] h-[25px] hover:scale-105" />
                            {unread > 0 && <CircleAlert className="absolute -top-2 -right-3 cursor-pointer w-[15px] text-yellow-500"></CircleAlert>}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Announcements</p>
                    </TooltipContent>
                </Tooltip>
            </CardContent>
        </Card>
    );
};

export default ClassCard;