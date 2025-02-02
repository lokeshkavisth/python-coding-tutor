"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "ai";
  content: string;
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scroll

  useEffect(() => {
    // Auto-scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchAnswer(prompt: string) {
    setLoading(true);
    const errMsg = "Something went wrong! Please try again later.";

    try {
      const response = await fetch(`/api/coding-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result) {
        throw new Error(errMsg);
      }

      setMessages((messages) => [...messages, { role: "ai", content: result }]);
    } catch (error) {
      setMessages((messages) => [...messages, { role: "ai", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    await fetchAnswer(input);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-200px)] p-4">
        <div className="flex-1 flex flex-col justify-end min-h-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "ai" && (
                <Avatar>
                  <AvatarImage
                    src="/logo.svg"
                    alt="langly"
                    className="size-4 object-cover"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                AI is thinking...
              </div>
            </div>
          )}

          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading}>
          {loading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </>
  );
}

export default ChatInterface;
