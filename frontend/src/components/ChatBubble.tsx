"use client";

import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 mr-3 mt-1 border border-emerald-100 bg-emerald-50">
          <AvatarFallback className="bg-transparent text-emerald-600">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div
          className={`px-4 py-3 shadow-sm ${
            isUser
              ? "bg-emerald-600 text-white rounded-2xl rounded-tr-none"
              : "bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none whitespace-pre-wrap"
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1 uppercase tracking-wider">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 ml-3 mt-1 bg-slate-100 text-slate-600">
          <AvatarFallback className="bg-transparent">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
