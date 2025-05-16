import { Layout } from "@/app/layout";
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import config from "@/config";
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Reply, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Messages() {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [currentMessage, setCurrentMessage] = useState(null);
  const [reply, setReply] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      setUser(user['sub']);
    }
  }, [])

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${config.backendUrl}/messages/user`, {
          params: {
            user_id: user['id'],
          }
        });
        console.log(res.data);
        const updatedMessages = await res.data['messages'].map(async (message) => {
          const res = await axios.get(`${config.backendUrl}/class`, { params: { id: message.class_id } })
          message.class = res.data['class'];
          return message;
        });
        Promise.all(updatedMessages).then((data) => {
          console.log(data);
          setMessages(data);
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    fetchMessages().then(() => {
      console.log("Fetched messages");
      setLoading(false);
    });
  }, [user]);

  const onDelete = (id) => {
    axios.delete(`${config.backendUrl}/messages`, {
      params: {
        id: id,
      }
    })
      .then((response) => {
        console.log("Message deleted:", response.data);
        setMessages(messages.filter((message) => message.id !== id));
        setCurrentMessage(null);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }

  if (loading) {
    return (
      <Layout title={"Messages"}>
        <div className="container mx-auto max-w-[1200px] flex flex-1 flex-col gap-4 p-8">
          <h1 className="text-4xl font-bold">Your Messages</h1>
          <div className="flex flex-1 flex-col gap-4 py-4">
            <Card className="w-full h-full flex flex-row">
              <div className="max-w-[300px] flex flex-1 flex-col gap-4 p-4">
                <h2 className="text-lg font-bold">Messages</h2>
                <Separator />
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="w-full h-[130px] rounded-xl" />
                ))}
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Skeleton className="w-full h-[130px] rounded-xl" />
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={"Messages"}>
      <div className="container mx-auto max-w-[1200px] flex flex-1 flex-col gap-4 p-8">
        <h1 className="text-4xl font-bold">Your Messages</h1>
        <div className="flex flex-1 flex-col gap-4 py-4">
          <Card className="w-full h-full flex flex-row">
            <div className="max-w-[250px] flex flex-1 flex-col gap-4 p-4">
              <h2 className="text-lg font-bold">Messages</h2>
              <Separator />
              {messages.map((message) => (
                <button key={message.id}
                  className={`hover:cursor-pointer hover:bg-gray-50 rounded ${currentMessage?.id === message.id ? "bg-gray-100" : "bg-white"
                    }`}
                  onClick={() => {
                    setReply(false)
                    setError("");
                    console.log("read: ", message.has_read);
                    if (message.has_read === 1)
                      return;
                    message.has_read += 1;
                    setCurrentMessage({...message});
                    console.log("Data to be sent:", currentMessage);

                    axios.put(`${config.backendUrl}/messages`, message)
                    .then((response) => {
                        console.log("Message updated successfully", response.data);
                    }).catch((error) => {
                        console.error("Error updating message:", error);
                        setError("Error updating message: " + error.response.data.message);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                  }
                  }>
                  <MessageCard key={message.id} message={message} />
                </button>
              ))}
            </div>
            <Separator orientation="vertical" />
            {currentMessage && (
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-bold">Message Details</h2>
                  <div className="flex flex-row gap-4">
                    <Reply className="text-muted-foreground hover:cursor-pointer" size={24} onClick={() => setReply(!reply)} />
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash2 className="text-muted-foreground hover:cursor-pointer" size={24} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { onDelete(currentMessage.id) }}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <h3 className="text-md font-semibold">Subject: </h3>
                    <Separator orientation="vertical" />
                    <h3 className="text-md">{currentMessage.title}</h3>
                  </div>
                  <Separator />
                  <div className="flex flex-row gap-4">
                    <h3 className="text-md font-semibold pr-4">Class:</h3>
                    <Separator orientation="vertical" />
                    <h3 className="text-md">{currentMessage.class.class_name}</h3>
                  </div>
                  <Separator />
                  <p className="whitespace-pre-line">{currentMessage.message}</p>
                </div>
                {reply && (
                  <ReplyBox message={currentMessage} />
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function MessageCard({ message }) {
  const [sender, setSender] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.backendUrl}/user`, { params: { id: message.sender_user_id } })
      .then((response) => {
        setSender(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching sender:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [message.sender_user_id])

  if (loading) {
    return (
      <div className="w-full h-[130px] flex flex-col text-left">
        <Skeleton className="w-full h-[130px] rounded-xl" />
        <Separator />
      </div>
    )
  }

  return (
    <div className="w-full h-[100px] flex flex-col text-left">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {message.has_read != "0" &&
          <h2 className="text-sm font-semibold line-clamp-2">{message.title}</h2>
        }
        {message.has_read == "0" &&
          <h2 className="text-sm font-bold line-clamp-2">{message.title}</h2>
        }
        <p className="text-sm text-gray-500">{sender.first_name} {sender.last_name}</p>
      </div>
      <Separator />
    </div>
  )
}

function ReplyBox({ message }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = () => {
    setLoading(true);
    const formattedReply = `${reply}\n\n--- Previous Message ---\n${message.message}`;

    axios.post(`${config.backendUrl}/messages`, {
      title: `Re: ${message.title}`,
      message: formattedReply,
      sender_user_id: message.receiver_user_id,
      receiver_user_id: message.sender_user_id,
      class_id: message.class_id,
    })
      .then((response) => {
        console.log("Reply sent:", response.data);
        setReply("");
      })
      .catch((error) => {
        console.error("Error sending reply:", error);
      })
      .finally(() => {
        setLoading(false);
        setReply(false);
      });
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Textarea
        className="w-full h-[100px] p-2 border rounded"
        placeholder="Type your reply here..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <Button className="max-w-[100px]" onClick={handleReply}>Send Reply</Button>
    </div>
  )
} 