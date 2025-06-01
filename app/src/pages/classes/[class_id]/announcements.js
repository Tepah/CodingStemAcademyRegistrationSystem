import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/app/layout';
import axios from 'axios';
import config from '@/config';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { jwtDecode } from 'jwt-decode';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash, Trash2, X } from 'lucide-react';

export default function ClassAnnouncements() {
    const [classData, setClassData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { class_id } = router.query;
    const [crumbs, setCrumbs] = useState([
        { name: 'Home', href: '/dashboard' },
        { name: 'Classes', href: '/classes' },
        { name: 'Class', href: `/classes/${class_id}` },
        { name: 'Announcements', href: `/classes/${class_id}/announcements` },
    ]);


    useEffect(() => {
        if (!class_id) return;

        const fetchClassData = async () => {
            try {
                const res = await axios.get(`${config.backendUrl}/class`, { params: { id: class_id } });
                console.log(res.data);
                setClassData(res.data['class']);
                setCrumbs(prevCrumbs => {
                    const updatedCrumbs = [...prevCrumbs];
                    updatedCrumbs[2] = { name: res.data['class'].class_name, href:
                        `/classes/${class_id}` };
                    return updatedCrumbs;
                });
            } catch (error) {
                console.error('Error fetching class data:', error);
            }
        };

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = jwtDecode(token)['sub'];
                const res = await axios.get(`${config.backendUrl}/class-messages`, { params: { class_id: class_id, user_id: user['id'] } });
                console.log(res.data);
                setMessages(res.data['messages']);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        Promise.all([fetchClassData(), fetchMessages()])
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [class_id]);


    return (
        <Layout breadcrumbs={crumbs} title={`${classData ? classData.class_name : 'Class'} Announcements`}>
            <div className="container max-w-[900px] h-full mx-auto flex flex-col gap-4 my-8">
                {loading ? (
                    <Skeleton className="w-full h-[50px]" />
                ) :
                    (
                        <h1 className="text-4xl font-bold">{classData.class_name} Announcements</h1>
                    )}
                <Card className="w-full h-full p-8">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="w-full h-[130px]" />
                            <Skeleton className="w-full h-[130px]" />
                            <Skeleton className="w-full h-[130px]" />
                            <Skeleton className="w-full h-[130px]" />
                            <Skeleton className="w-full h-[130px]" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col justify-center gap-4">
                            <h2 className="text-xl text-center">No announcements yet...</h2>
                        </div>
                    )
                        : (
                            <div className="flex flex-col gap-4">
                                {messages.map((message) => (
                                    <div key={message.id}>
                                        <MessageCard message={message} />
                                        <Separator />
                                    </div>
                                ))}
                            </div>
                        )}
                </Card>
            </div>
        </Layout>
    )
}

function MessageCard({ message }) {
    const [expanded, setExpanded] = useState(false);

    const onDelete = async () => {
        try {
            const res = await axios.delete(`${config.backendUrl}/messages`, { params: { id: message.id } });
            console.log(res.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }


    return (
        <div className="relative w-full h-full">
            <Button variant="ghost" className="w-full h-full flex flex-col gap-4 p-4" onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                    <div className="w-full flex flex-row justify-between p-4" >
                        <div className="flex flex-col flex-1 w-3/5 text-left">
                            <h2 className="text-xl font-bold">{message.title}</h2>
                            <p className="break-words whitespace-pre-line">{message.message}</p>

                        </div>
                        <div className="flex flex-col flex-1 w-1/4 text-right">
                            <p className="text-sm font-semibold">Sent at:</p>
                            <p className="text-sm text-gray-500">{new Date(message.sent_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-h-[120px] flex flex-row justify-between p-4">
                        <div className="flex flex-col w-3/5 text-left">
                            <h2 className="text-xl font-bold">{message.title}</h2>
                            <p className="truncate">{message.message}</p>
                        </div>
                        <div className="flex flex-col w-1/4 text-right">
                            <p className="text-sm font-semibold">Sent at:</p>
                            <p className="text-sm text-gray-500">{new Date(message.sent_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                )
                }
            </Button>
            {expanded && <X className="absolute top-4 right-4 cursor-pointer" onClick={onDelete} />}
        </div>
    )
}