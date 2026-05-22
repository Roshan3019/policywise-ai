"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SparklesCore } from "@/components/ui/sparkles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, ShieldQuestion, ExternalLink } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { sendChat, type ChatSource } from "@/lib/api";

const QUICK_TOPICS = ["Zero Depreciation", "No Claim Bonus (NCB)", "Insured Declared Value", "Third-Party Cover", "Claim Settlement Ratio"];

interface MessageWithSources extends ChatMessage {
  sources?: ChatSource[];
  fallback?: boolean;
}

const WELCOME: MessageWithSources = {
  id: "welcome",
  role: "ai",
  content: "👋 Hello! I'm PolicyWise AI — powered by real Bajaj Allianz policy documents.\n\nI can answer questions grounded in actual insurance policy wordings. Ask me anything about car insurance!",
  timestamp: new Date(),
};

function ChatInterface() {
  const [messages, setMessages] = useState<MessageWithSources[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) sendMessage(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;
    setError("");

    const userMsg: MessageWithSources = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChat(content);
      const aiMsg: MessageWithSources = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
        fallback: response.fallback,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed. Is the backend running?";
      setError(msg);
      // Add an error message to the chat
      const errMsg: MessageWithSources = {
        id: (Date.now() + 2).toString(),
        role: "ai",
        content: `⚠️ ${msg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Particle background */}
      <SparklesCore
        id="chat-bg-particles"
        background="transparent"
        minSize={0.3}
        maxSize={0.8}
        particleDensity={60}
        particleColor="#818cf8"
        speed={0.8}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Full-screen flex layout */}
      <div className="relative z-10 flex flex-col h-screen pt-16">
        <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto">

          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-black/40 backdrop-blur-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldQuestion size={20} />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-white text-base">AI Insurance Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-neutral-400 font-medium">Powered by GPT-4o-mini + Bajaj Policy Docs</span>
              </div>
            </div>
            {error && (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                ⚠ API Error
              </div>
            )}
          </div>

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <Avatar className="w-8 h-8 mr-3 mt-1 shrink-0 bg-indigo-500/20 border border-indigo-500/30">
                      <AvatarFallback className="bg-transparent text-indigo-400"><Bot size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-white rounded-br-sm"
                        : "bg-white/5 border border-white/10 text-neutral-200 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>

                    {/* Source citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.sources.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium"
                          >
                            <ExternalLink size={9} />
                            {s.source} · p{s.page}
                          </div>
                        ))}
                        {msg.fallback && (
                          <div className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                            No documents loaded — general knowledge used
                          </div>
                        )}
                      </div>
                    )}

                    <span suppressHydrationWarning className="text-[10px] text-neutral-600 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {isUser && (
                    <Avatar className="w-8 h-8 ml-3 mt-1 shrink-0 bg-white/5 border border-white/10">
                      <AvatarFallback className="bg-transparent text-neutral-400"><User size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-3 opacity-70">
                <Avatar className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 shrink-0">
                  <AvatarFallback className="bg-transparent text-indigo-400"><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 h-11 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick topic chips */}
          {messages.length < 3 && (
            <div className="px-6 py-3 border-t border-white/5 shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-neutral-600 mb-2 font-semibold">Quick topics</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => sendMessage(`What is ${t}?`)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white hover:border-indigo-500/40 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pinned input bar */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any insurance term, clause, or policy..."
                disabled={isLoading}
                className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-center text-[10px] text-neutral-600 mt-2 uppercase tracking-wider">
              Answers grounded in real Bajaj Allianz policy documents · Always verify before buying
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center text-neutral-400">
        Loading AI...
      </div>
    }>
      <ChatInterface />
    </Suspense>
  );
}
