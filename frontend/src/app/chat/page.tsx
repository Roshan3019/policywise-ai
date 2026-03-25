"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, ShieldQuestion } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const PHASE5_TOPICS = [
  "Zero Depreciation",
  "No Claim Bonus (NCB)",
  "Insured Declared Value",
  "Third-Party Cover",
  "Engine Protection",
  "Claim Settlement",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "ai",
  content:
    "👋 Hello! I'm PolicyWise AI, your intelligent insurance advisor.\n\nI can help you understand car insurance concepts, explain policy terms, and guide your coverage decisions.\n\n⚡ Full AI capabilities are being wired in Phase 5. For now, try clicking a quick topic below or asking me what a term means!",
  timestamp: new Date(),
};

function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      sendMessage(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Phase 5 stub simulation
    await new Promise((r) => setTimeout(r, 1000));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: generateStubResponse(content),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen pt-16 bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-3xl flex-1 flex flex-col bg-white border-x border-slate-200 shadow-sm relative h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldQuestion size={20} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-slate-900">AI Insurance Assistant</h1>
              <div className="flex items-center gap-1.5 opacity-80">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-500">Available · Phase 5 Stub mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-2 pb-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex items-end gap-3 opacity-70 animate-fade-in pl-1">
                <div className="w-8 h-8 rounded-full border border-emerald-100 bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1 shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-slate-50 text-slate-500 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-1.5 h-[46px]">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Quick Topics */}
        {messages.length < 3 && (
          <div className="p-4 bg-slate-50/50 block">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Most Asked</p>
             <div className="flex flex-wrap gap-2 px-2">
               {PHASE5_TOPICS.map((topic) => (
                 <button
                   key={topic}
                   onClick={() => sendMessage(`What is ${topic}?`)}
                   className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm"
                 >
                   {topic}
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-2 max-w-full"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. Explain No Claim Bonus like I'm 5..."
              className="flex-1 h-12 shadow-sm rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md shrink-0 flex items-center justify-center p-0"
            >
              <Send size={18} />
            </Button>
          </form>
          <div className="text-center mt-3 mb-1">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI can make mistakes. Verify policy terms before buying.</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center">Loading AI...</div>}>
      <ChatInterface />
    </Suspense>
  );
}

function generateStubResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("idv") || q.includes("declared value"))
    return "The **Insured Declared Value (IDV)** is essentially the maximum sum assured fixed by the insurer which is provided on theft or total loss of vehicle. Think of it as the current market value of your car.\n\nIt is calculated by applying a depreciation percentage to the manufacturer's selling price of the car.";

  if (q.includes("ncb") || q.includes("no claim bonus"))
    return "🏆 **No Claim Bonus (NCB)** is a discount in premium offered by car insurance companies to policyholders for not making any claims during the policy term. It's a reward for safe driving!\n\nThe discount typically starts at 20% for the first claim-free year and can go up to 50% for 5 consecutive claim-free years.";

  if (q.includes("zero dep") || q.includes("depreciation"))
    return "🛡️ **Zero Depreciation Cover** (also known as Nil Depreciation or Bumper to Bumper policy) is a popular add-on that offers complete external coverage for your car without factoring in depreciation.\n\nWithout this, if your car is damaged, you'll only receive the depreciated value of the replaced parts, meaning you pay the difference out of pocket.";

  return `I understand you're asking about **"${query}"**.\n\nCurrently, I am in Phase 2 stub mode. Comprehensive AI answers with RAG-based context parsing will be available in Phase 5.\n\nIn the meantime, feel free to use the Recommend or Compare tools!`;
}
