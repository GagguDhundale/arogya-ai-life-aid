import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, User, Send, Loader2, Brain, Heart, Activity, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function PatientAICopilot() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPatientId();
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPatientId = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPatientId(data.id);
    } catch (error) {
      console.error('Error loading patient ID:', error);
    }
  };

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (patientData) {
        const { data, error } = await supabase
          .from('patient_ai_chat_sessions')
          .select('conversation_history')
          .eq('patient_id', patientData.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (data && data.conversation_history) {
          const history = data.conversation_history as any[];
          setMessages(history.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          // Initialize with welcome message
          setMessages([{
            id: '1',
            type: 'ai',
            content: "Hello! I'm your AI Health Assistant. I can help you with:\n\n• Understanding symptoms\n• Medication reminders\n• Health tips and advice\n• Preparing for doctor visits\n• Answering general health questions\n\nHow can I assist you today?",
            timestamp: new Date(),
            suggestions: [
              "Tell me about my upcoming appointments",
              "What should I know about my symptoms?",
              "Give me health tips for today",
              "Help me prepare for my doctor visit"
            ]
          }]);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Initialize with welcome message on error
      setMessages([{
        id: '1',
        type: 'ai',
        content: "Hello! I'm your AI Health Assistant. How can I help you today?",
        timestamp: new Date()
      }]);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    if (!patientId) return;

    try {
      const conversationHistory = newMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));

      const { data: existingSession } = await supabase
        .from('patient_ai_chat_sessions')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      if (existingSession) {
        await supabase
          .from('patient_ai_chat_sessions')
          .update({
            conversation_history: conversationHistory,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSession.id);
      } else {
        await supabase
          .from('patient_ai_chat_sessions')
          .insert({
            patient_id: patientId,
            conversation_history: conversationHistory
          });
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple AI response logic - in a real app, this would call an AI service
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
      return "I can see you're asking about appointments. Based on your profile, you have an upcoming appointment with Dr. Johnson next week. Would you like me to help you prepare questions for your visit or provide information about what to expect?";
    }
    
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('sick')) {
      return "I understand you're concerned about symptoms. While I can provide general health information, it's important to consult with your healthcare provider for proper diagnosis. Would you like me to help you document your symptoms to discuss with your doctor?";
    }
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      return "For medication-related questions, I recommend speaking with your doctor or pharmacist. However, I can help you set up medication reminders or provide general information about medication adherence. What specific help do you need?";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('nutrition')) {
      return "Great question about nutrition! A balanced diet is crucial for your health. Based on general guidelines, aim for plenty of vegetables, lean proteins, whole grains, and stay hydrated. Would you like specific tips for your health goals?";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
      return "Regular exercise is excellent for your health! For personalized exercise recommendations, consider your current fitness level and any health conditions. Always consult your doctor before starting a new exercise program. Would you like some general fitness tips?";
    }
    
    return "Thank you for your question. I'm here to provide general health information and support. For specific medical advice, please consult with your healthcare provider. Is there a particular health topic you'd like to learn more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "What should I do next?",
          "Can you help with something else?",
          "Thank you, that's helpful"
        ]
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickActions = [
    { icon: Heart, label: "Check symptoms", message: "I have some symptoms I'd like to discuss" },
    { icon: Activity, label: "Health tips", message: "Give me some health tips for today" },
    { icon: Brain, label: "Medication help", message: "I need help with my medications" },
    { icon: MessageCircle, label: "Doctor prep", message: "Help me prepare for my doctor visit" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chat Interface */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] bg-white/80 border-medical-200 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Health Assistant
              <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' ? 'bg-medical-500' : 'bg-accent-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-medical-500 text-white' 
                            : 'bg-accent-50 border border-accent-200'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-medical-100' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Suggestions */}
                    {message.type === 'ai' && message.suggestions && (
                      <div className="flex flex-wrap gap-2 ml-11">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 border-accent-200 hover:bg-accent-50"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-accent-50 border border-accent-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent-600" />
                        <span className="text-sm text-accent-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input Area */}
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your health..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-medical-500 hover:bg-medical-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Sidebar */}
      <div className="space-y-4">
        <Card className="bg-white/80 border-medical-200">
          <CardHeader>
            <CardTitle className="text-medical-700 text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3 border-medical-200 hover:bg-medical-50"
                onClick={() => handleSuggestionClick(action.message)}
              >
                <action.icon className="h-4 w-4 mr-2 text-medical-500" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Brain className="h-8 w-8 text-accent-600 mx-auto mb-2" />
              <h3 className="font-semibold text-accent-700 mb-1">AI Health Assistant</h3>
              <p className="text-xs text-accent-600">
                Get instant answers to your health questions and personalized recommendations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Heart className="h-6 w-6 text-warning-600 mx-auto mb-2" />
              <p className="text-xs text-warning-700 font-medium">
                Remember: This AI assistant provides general health information only. Always consult your healthcare provider for medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}