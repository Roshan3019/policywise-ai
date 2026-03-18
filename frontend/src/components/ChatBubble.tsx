"use client";

import type { ChatMessage } from "@/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--grad-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            marginRight: "10px",
            flexShrink: 0,
            alignSelf: "flex-end",
          }}
        >
          🤖
        </div>
      )}

      <div>
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
          {message.content}
        </div>
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--text-subtle)",
            marginTop: "4px",
            textAlign: isUser ? "right" : "left",
            paddingLeft: isUser ? 0 : "4px",
          }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            marginLeft: "10px",
            flexShrink: 0,
            alignSelf: "flex-end",
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}
