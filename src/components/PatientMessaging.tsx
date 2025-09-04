import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Paperclip, Video, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'action_plan';
  read: boolean;
}

interface PatientMessagingProps {
  patientId: string;
  patientName: string;
  onVideoCall?: () => void;
  onScheduleAppointment?: () => void;
}

export default function PatientMessaging({ 
  patientId, 
  patientName, 
  onVideoCall, 
  onScheduleAppointment 
}: PatientMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadMessages();
    // Set up real-time messaging
    const channel = supabase
      .channel(`patient-messages-${patientId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'patient_messages',
          filter: `patient_id=eq.${patientId}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const loadMessages = () => {
    // Simulate loading messages
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'patient',
        content: 'My cough is getting worse and I have a fever. Should I be concerned?',
        timestamp: '2024-03-20T14:30:00Z',
        type: 'text',
        read: true
      },
      {
        id: '2',
        sender: 'doctor',
        content: 'I understand your concern. Based on your symptoms, I recommend monitoring your temperature and staying hydrated. Let\'s schedule a video consultation to assess you properly.',
        timestamp: '2024-03-20T14:35:00Z',
        type: 'text',
        read: true
      },
      {
        id: '3',
        sender: 'doctor',
        content: 'I\'ve created a care plan for you with specific instructions. Please follow the medication schedule and report any worsening symptoms immediately.',
        timestamp: '2024-03-20T14:40:00Z',
        type: 'action_plan',
        read: true
      },
      {
        id: '4',
        sender: 'patient',
        content: 'Thank you doctor. I\'ve started the medications. Should I continue my regular BP medication?',
        timestamp: '2024-03-20T16:15:00Z',
        type: 'text',
        read: false
      }
    ];
    
    setMessages(mockMessages);
    setUnreadCount(mockMessages.filter(m => !m.read && m.sender === 'patient').length);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');

    // Simulate patient typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'patient',
          content: 'Thank you for the guidance, doctor. I will follow your instructions.',
          timestamp: new Date().toISOString(),
          type: 'text',
          read: false
        };
        setMessages(prev => [...prev, autoReply]);
        setUnreadCount(prev => prev + 1);
      }, 2000);
    }, 1000);
  };

  const sendActionPlan = () => {
    const actionPlan: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      content: 'Care Plan:\n1. Rest and stay hydrated\n2. Take prescribed antihistamine\n3. Monitor temperature\n4. Avoid outdoor activities during high pollen days\n5. Follow up in 3 days if symptoms persist',
      timestamp: new Date().toISOString(),
      type: 'action_plan',
      read: true
    };

    setMessages(prev => [...prev, actionPlan]);
    toast.success('Action plan sent to patient');
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
    setUnreadCount(0);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat with {patientName}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onVideoCall}>
              <Video className="h-4 w-4 mr-1" />
              Video Call
            </Button>
            <Button size="sm" variant="outline" onClick={onScheduleAppointment}>
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            {unreadCount > 0 && (
              <Button size="sm" onClick={markAllAsRead}>
                Mark Read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'doctor'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } ${!message.read && message.sender === 'patient' ? 'ring-2 ring-yellow-300' : ''}`}
              >
                {message.type === 'action_plan' && (
                  <div className="flex items-center gap-1 mb-2">
                    <Paperclip className="h-3 w-3" />
                    <span className="text-xs font-semibold">Action Plan</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
          <Button size="sm" variant="outline" onClick={sendActionPlan}>
            <Paperclip className="h-4 w-4 mr-1" />
            Send Action Plan
          </Button>
          <Button size="sm" variant="outline">
            <Paperclip className="h-4 w-4 mr-1" />
            Educational Material
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to patient..."
            className="flex-1 min-h-[60px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}