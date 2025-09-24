import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi there! 👋 I'm Flux, your AdFlow Fusion assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date()
  }
];

const quickReplies = [
  "How do I add a new widget?",
  "Explain match types",
  "Set up notifications",
  "Dashboard tour"
];

export function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2); // Start from 2 since initial message has id 1

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMessageId = messageIdCounter;
    const newBotMessageId = messageIdCounter + 1;

    const userMessage: Message = {
      id: newUserMessageId,
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setMessageIdCounter(prev => prev + 2); // Increment by 2 to account for both messages

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: newBotMessageId,
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("widget")) {
      return "To add a new widget, click the '+' button in the top right of your dashboard, then drag and drop widgets to customize your layout! 🎯";
    } else if (lowerMessage.includes("match type")) {
      return "Great question! Broad match reaches the widest audience, Phrase match targets specific phrases, and Exact match is the most precise. Each card shows real-time performance metrics! 📊";
    } else if (lowerMessage.includes("notification")) {
      return "You can set up alerts in the Settings menu. Choose what metrics to track and we'll notify you of important changes! 🔔";
    } else if (lowerMessage.includes("tour") || lowerMessage.includes("help")) {
      return "I'd be happy to give you a tour! The dashboard shows your three match types, you can drag widgets around, and use the sidebar to navigate between sections. Want me to highlight any specific area? ✨";
    } else {
      return "I'm here to help! Feel free to ask about widgets, match types, notifications, or anything else about AdFlow Fusion. What would you like to know? 😊";
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        
        {/* Pulsing indicator */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-80 h-96 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm">Flux Assistant</div>
                    <div className="text-xs text-muted-foreground">Always here to help</div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col h-full">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          message.isBot
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted px-3 py-2 rounded-lg">
                        <motion.div
                          className="flex space-x-1"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick replies */}
                {messages.length === 1 && (
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
                    <div className="flex flex-wrap gap-1">
                      {quickReplies.map((reply, index) => (
                        <motion.button
                          key={reply}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSendMessage(reply)}
                          className="text-xs px-2 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}