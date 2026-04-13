"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}


export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Yo, this is ChatterBot! How can I help you today?",
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const callGetResponse = async () => {
    if (!theInput.trim()) return;

    const userMessage: Message = { role: "user", content: theInput };
    setMessages((prev) => [...prev, userMessage]);
    setTheInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      const { output } = data;

      setMessages((prev) => [...prev, output]);
    } catch (error) {
      console.error("Error calling AI:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I hit an error. Try again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      callGetResponse();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 selection:bg-purple-500/30">
      <div className="z-10 w-full max-w-2xl items-center justify-between font-sans flex flex-col gap-8">
        <header className="text-center space-y-2 animate-message">
          <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-tr from-primary-600 to-accent bg-clip-text text-transparent italic">
            ChatterBot
          </h1>
          <p className="text-foreground/60 font-medium">Chatterbot</p>
        </header>

        <div className="glass w-full h-[600px] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} animate-message`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === "assistant"
                      ? "bg-primary-50/50 dark:bg-white/10 text-foreground border border-primary-200/50 dark:border-white/10 rounded-tl-none"
                      : "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tr-none"
                  }`}
                >
                  {msg.content}
                </div>

              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/10 text-foreground/50 rounded-2xl px-5 py-3 text-sm italic rounded-tl-none">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-sm">
            <div className="relative flex items-end gap-2">
              <textarea
                value={theInput}
                onChange={(e) => setTheInput(e.target.value)}
                onKeyDown={Submit}
                placeholder="Type a message..."
                className="flex-1 max-h-32 min-h-[50px] bg-white/5 text-foreground rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none custom-scrollbar transition-all placeholder:text-foreground/30 text-sm"
              />
              <button
                onClick={callGetResponse}
                disabled={isLoading || !theInput.trim()}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-primary-600/20 active:scale-95 group mb-1"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 fill-current -rotate-25 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>

            </div>
          </div>
        </div>

        <footer className="text-foreground/20 text-[10px] uppercase tracking-widest font-bold">
          Powered by Learning & Innovation
        </footer>
      </div>
    </main>
  );
}