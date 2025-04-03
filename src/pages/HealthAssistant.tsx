
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { sampleMetrics } from '@/data/sampleData';
import { 
  MessageCircle, Heart, SendHorizontal, 
  Search, Trash, Archive, Copy, CornerDownLeft, 
  Bot, Lightbulb, BookOpen, RotateCcw, AlertCircle, Zap
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type SavedChat = {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
  messages: Message[];
};

const HealthAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([
    {
      id: '1',
      title: 'Blood pressure concerns',
      lastMessage: 'What can I do to lower my blood pressure naturally?',
      date: new Date('2023-10-15'),
      messages: [
        {
          id: '1-1',
          role: 'user',
          content: 'What can I do to lower my blood pressure naturally?',
          timestamp: new Date('2023-10-15T14:30:00')
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'There are several lifestyle changes that can help lower blood pressure naturally:\n\n1. Maintain a healthy weight\n2. Regular exercise (at least 30 minutes most days)\n3. Eat a diet rich in fruits, vegetables, and low-fat dairy\n4. Reduce sodium intake (aim for less than 2,300mg per day)\n5. Limit alcohol consumption\n6. Quit smoking\n7. Reduce stress through meditation or other relaxation techniques\n8. Monitor your blood pressure regularly\n\nThese changes, along with any medications prescribed by your doctor, can help manage your blood pressure effectively.',
          timestamp: new Date('2023-10-15T14:31:00')
        }
      ]
    },
    {
      id: '2',
      title: 'Cholesterol questions',
      lastMessage: 'What foods should I avoid to lower my cholesterol?',
      date: new Date('2023-10-10'),
      messages: [
        {
          id: '2-1',
          role: 'user',
          content: 'What foods should I avoid to lower my cholesterol?',
          timestamp: new Date('2023-10-10T10:15:00')
        },
        {
          id: '2-2',
          role: 'assistant',
          content: 'To help lower your cholesterol, try to avoid or limit these foods:\n\n1. Foods high in saturated fats (fatty meats, full-fat dairy)\n2. Foods containing trans fats (some packaged foods and baked goods)\n3. Foods high in cholesterol (organ meats, egg yolks in excess)\n4. Processed meats (sausages, bacon, hot dogs)\n5. Fast food and fried foods\n6. Baked goods made with butter or shortening\n7. Certain tropical oils (coconut, palm)\n\nInstead, focus on eating:\n- Oats and barley\n- Fatty fish (salmon, mackerel)\n- Nuts and seeds\n- Fruits and vegetables\n- Beans and legumes\n- Olive oil\n- Foods with added plant sterols',
          timestamp: new Date('2023-10-10T10:16:00')
        }
      ]
    }
  ]);
  const [currentChat, setCurrentChat] = useState<SavedChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      // Simple pattern matching for demo purposes
      if (input.toLowerCase().includes('blood pressure')) {
        response = "Based on your recent readings, your blood pressure has been trending downward, which is positive. Your last reading was 122/78 mmHg, which is within the normal range. Continue with your current medications and lifestyle changes as they appear to be working well.";
      } else if (input.toLowerCase().includes('cholesterol')) {
        response = "Your latest cholesterol panel shows improvement. Total cholesterol is now 182 mg/dL (down from 190), with LDL at 104 mg/dL and HDL at 63 mg/dL. Continue with your current diet and medication regimen, and consider increasing foods rich in omega-3 fatty acids.";
      } else if (input.toLowerCase().includes('glucose') || input.toLowerCase().includes('sugar')) {
        response = "Your fasting glucose has been stable at 92 mg/dL, which is within the normal range. Your post-meal readings have improved significantly from 142 to 128 mg/dL, indicating better glucose control. Keep monitoring and maintaining your current approach.";
      } else if (input.toLowerCase().includes('medication') || input.toLowerCase().includes('medicine')) {
        response = "You're currently taking Lisinopril (10mg once daily), Atorvastatin (20mg once daily), and Metformin (500mg twice daily). Based on your latest health metrics, these medications appear to be effective. Remember to take them as prescribed and discuss any side effects with your doctor.";
      } else if (input.toLowerCase().includes('exercise') || input.toLowerCase().includes('workout')) {
        response = "Regular exercise is beneficial for your conditions. Based on your health profile, moderate aerobic activity for 150 minutes per week (like brisk walking) combined with muscle-strengthening activities twice weekly would be ideal. Always start any new exercise routine gradually and consult your doctor if you experience chest pain, dizziness, or unusual shortness of breath.";
      } else if (input.toLowerCase().includes('diet') || input.toLowerCase().includes('food') || input.toLowerCase().includes('eat')) {
        response = "For your health profile, a diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is recommended. Limit sodium to help with blood pressure, and reduce saturated and trans fats to help with cholesterol. Your recent improvements in health metrics suggest your dietary changes have been effective.";
      } else {
        response = "I understand you're asking about your health. Based on your recent metrics, you're showing improvements across several key indicators. Your blood pressure, cholesterol, and glucose levels are all trending in the right direction. Continue with your current treatment plan and lifestyle modifications. Is there a specific aspect of your health you'd like more information about?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const startNewChat = () => {
    setMessages([]);
    setCurrentChat(null);
  };
  
  const saveCurrentChat = () => {
    if (messages.length === 0) {
      toast({
        title: "Cannot save empty chat",
        description: "Please start a conversation before saving.",
      });
      return;
    }
    
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return;
    
    const newChat: SavedChat = {
      id: Date.now().toString(),
      title: firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : ''),
      lastMessage: firstUserMessage.content,
      date: new Date(),
      messages: [...messages]
    };
    
    setSavedChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    
    toast({
      title: "Chat saved",
      description: "Your conversation has been saved for future reference.",
    });
  };
  
  const loadChat = (chat: SavedChat) => {
    setMessages(chat.messages);
    setCurrentChat(chat);
  };
  
  const deleteChat = (id: string) => {
    setSavedChats(prev => prev.filter(chat => chat.id !== id));
    if (currentChat?.id === id) {
      setMessages([]);
      setCurrentChat(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Health Assistant</h1>
        <p className="text-muted-foreground">Get insights and answers about your health</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={startNewChat}>
            <MessageCircle className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
          
          <Tabs defaultValue="saved">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="space-y-4 mt-4">
              {savedChats.length > 0 ? (
                <div className="space-y-2">
                  {savedChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentChat?.id === chat.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => loadChat(chat)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate flex-1">{chat.title}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                          className={`p-1 rounded-full ${
                            currentChat?.id === chat.id 
                              ? 'hover:bg-primary-foreground/10' 
                              : 'hover:bg-muted-foreground/10'
                          }`}
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-xs truncate mt-1 opacity-70">
                        {chat.lastMessage}
                      </div>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(chat.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No saved conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat and save it for future reference</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="suggested" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div 
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setInput("What do my latest cholesterol numbers mean?");
                    setMessages([]);
                    setCurrentChat(null);
                  }}
                >
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-health-blue" />
                    <div className="font-medium">Cholesterol Analysis</div>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground pl-6">
                    Understand your latest lipid panel results
                  </div>
                </div>
                
                <div 
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setInput("What lifestyle changes would help my blood pressure?");
                    setMessages([]);
                    setCurrentChat(null);
                  }}
                >
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-health-blue" />
                    <div className="font-medium">Blood Pressure Tips</div>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground pl-6">
                    Get personalized lifestyle recommendations
                  </div>
                </div>
                
                <div 
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setInput("How do my medications work together?");
                    setMessages([]);
                    setCurrentChat(null);
                  }}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-health-blue" />
                    <div className="font-medium">Medication Interactions</div>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground pl-6">
                    Learn how your medications work together
                  </div>
                </div>
                
                <div 
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setInput("What does my glucose trend indicate?");
                    setMessages([]);
                    setCurrentChat(null);
                  }}
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-health-blue" />
                    <div className="font-medium">Glucose Trends</div>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground pl-6">
                    Understand your blood sugar patterns
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 mr-2 text-health-blue" />
              <h3 className="font-medium">Important Note</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This health assistant is for informational purposes only and should not replace professional medical advice.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Always consult your healthcare provider before making changes to your treatment plan.
            </p>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-13rem)]">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Health Assistant</CardTitle>
                    <CardDescription className="text-xs">AI-powered health information</CardDescription>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={saveCurrentChat} disabled={messages.length === 0}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={startNewChat} disabled={messages.length === 0}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>New conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 overflow-y-auto h-[calc(100%-13rem)]">
              <div className="py-4 px-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center h-full flex flex-col items-center justify-center p-8">
                    <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">How can I help you today?</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      I can analyze your health data, answer questions about your metrics, 
                      and provide insights based on your health information.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
                      <Button variant="outline" className="justify-start" onClick={() => setInput("What do my latest health metrics mean?")}>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze my health data
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => setInput("How can I improve my cholesterol levels?")}>
                        <Heart className="mr-2 h-4 w-4" />
                        Cholesterol improvement tips
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => setInput("What do my medication side effects mean?")}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Medication information
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => setInput("How are my health trends looking?")}>
                        <BarChartIcon className="mr-2 h-4 w-4" />
                        Health trend analysis
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0 mt-1">
                          {message.role === 'user' ? (
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              U
                            </div>
                          ) : (
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        <div className={`mx-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`px-4 py-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%]">
                      <div className="flex-shrink-0 mt-1">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="mx-2">
                        <div className="px-4 py-3 rounded-lg bg-muted">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-pulse delay-150"></div>
                            <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-pulse delay-300"></div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Thinking...
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="p-4 border-t mt-auto">
              <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your health metrics, medications, or general health questions..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
