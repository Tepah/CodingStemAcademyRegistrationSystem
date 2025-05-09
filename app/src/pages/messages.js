import { Layout } from "@/app/layout";
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import config from "@/config";
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";

export default function Messages() {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);

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
        const res = await axios.get(`${config.backendUrl}/messages`, {
          params: {
            user_id: user['id'],
          }
        });
        console.log(res.data);
        setMessages(res.data['messages']);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    fetchMessages().then(() => console.log("Fetched messages"));
  }, [user]);



  return (
    <Layout title={"Messages"}>
      <div className="container mx-auto max-w-[1200px] flex flex-1 flex-col gap-4 p-8">
        <h1 className="text-4xl font-bold mb-4">Your Messages</h1>
        <div className="flex flex-1 flex-col gap-4 py-4">
          <Card className="w-full h-full flex flex-row">
            <div className="max-w-[300px] flex flex-1 flex-col gap-4 p-4">
              <h2 className="text-lg font-bold">Messages</h2>
              <Separator />
              {messages.map((message) => (
                <button key={message.id}
                  className={`hover:cursor-pointer hover:bg-gray-50 rounded ${currentMessage?.id === message.id ? "bg-gray-100" : "bg-white"
                    }`}
                  onClick={() => setCurrentMessage(message)}>
                  <MessageCard key={message.id} message={message} />
                </button>
              ))}
            </div>
            <Separator orientation="vertical" />
            {currentMessage && (
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-bold">Message Details</h2>
                  <Reply className="text-muted-foreground hover:cursor-pointer" size={24} onClick={() => setCurrentMessage(null)} />
                </div>
                <Separator />
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <h3 className="text-md font-semibold">Subject: </h3>
                    <Separator orientation="vertical" />
                    <h3 className="text-md">{currentMessage.title}</h3>
                  </div>
                  <Separator />
                  <p>{currentMessage.message}</p>
                </div>
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
      });
  }, [])

  return (
    <div className="w-full h-[130px] flex flex-col text-left">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-md font-semibold">{message.title}</h2>
        <p className="text-gray-500">{sender.first_name} {sender.last_name}</p>
      </div>
      <Separator />
    </div>
  )
}