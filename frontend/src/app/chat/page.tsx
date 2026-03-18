"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import type { ChatMessage } from "@/lib/types";

const PHASE5_TOPICS = [
  "Zero Depreciation Coverage",
  "No Claim Bonus (NCB)",
  "Insured Declared Value (IDV)",
  "Comprehensive vs Third-Party",
  "Engine Protection Add-on",
  "Roadside Assistance",
  "Claim Settlement Process",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "ai",
  content:
    "👋 Hello! I'm PolicyWise AI, your intelligent insurance advisor.\n\nI can help you understand car insurance concepts, explain policy terms, and guide your coverage decisions.\n\n⚡ Full AI capabilities are being wired in Phase 5. For now, explore the topics below or ask me anything!\n\nTo compare and get recommendations, visit the Compare or Recommend pages.",
  timestamp: new Date(),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Phase 5 stub — returns an informative holding response
    await new Promise((r) => setTimeout(r, 800));

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
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "64px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "24px",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "var(--grad-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            🤖
          </div>
          <div>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>AI Insurance Assistant</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }}
              />
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Online · Full AI in Phase 5
              </p>
            </div>
          </div>
        </div>

        {/* Conversation area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            marginBottom: "20px",
            paddingRight: "4px",
          }}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
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
                }}
              >
                🤖
              </div>
              <div className="chat-bubble-ai" style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--text-muted)",
                      animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick topics */}
        {messages.length < 3 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginBottom: "8px" }}>
              Popular topics:
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PHASE5_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => sendMessage(`What is ${topic}?`)}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "20px",
                    background: "var(--glass-bg)",
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.5)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div
          className="glass"
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            borderRadius: "16px",
          }}
        >
          <input
            id="chat-input"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about car insurance..."
            disabled={isLoading}
            style={{
              border: "none",
              background: "transparent",
              flex: 1,
              fontSize: "0.9rem",
            }}
          />
          <button
            id="chat-send-btn"
            className="btn-primary"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            style={{ padding: "10px 20px", flexShrink: 0 }}
          >
            Send ↑
          </button>
        </div>
      </div>
    </main>
  );
}

/**
 * Phase 5 stub — generates a useful holding response.
 * Replace this with an API call in Phase 5.
 */
function generateStubResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("idv") || q.includes("insured declared value"))
    return "📋 **IDV (Insured Declared Value)** is the maximum amount your insurer will pay if your car is stolen or declared a total loss. It's calculated as the current market value of your car minus depreciation. A higher IDV means better protection but a higher premium.\n\n🔧 Full AI explanations with source citations are coming in Phase 5!";

  if (q.includes("ncb") || q.includes("no claim bonus"))
    return "🏆 **No Claim Bonus (NCB)** is a discount you earn for not making a claim during your policy year. It ranges from 20% (after 1 claim-free year) up to 50% (after 5+ years). NCB is a huge benefit — protect it!\n\n🔧 Full AI explanations with source citations are coming in Phase 5!";

  if (q.includes("zero dep") || q.includes("zero depreciation"))
    return "🛡️ **Zero Depreciation** (also called Nil Depreciation) is an add-on that ensures your insurer pays the full cost of parts replaced during a claim without deducting depreciation. Ideal for new cars in the first 3–5 years.\n\n🔧 Full AI explanations with source citations are coming in Phase 5!";

  if (q.includes("comprehensive"))
    return "🌟 **Comprehensive Insurance** covers both own damage (your car) AND third-party liability (damage to others). It's the most complete coverage available and includes protection against theft, natural calamities, and accidents.\n\n🔧 Full AI explanations with source citations are coming in Phase 5!";

  if (q.includes("third party") || q.includes("third-party"))
    return "⚖️ **Third-Party Insurance** is legally mandatory in India. It covers damage or injury caused to other people/property. It does NOT cover your own car's damage. It's affordable but limited in protection.\n\n🔧 Full AI explanations with source citations are coming in Phase 5!";

  return `🤔 Great question about **\"${query}\"**!\n\nOur full AI knowledge base with RAG-powered explanations is being built in Phase 5. Once live, I'll provide detailed, source-cited answers to every insurance question.\n\n👉 In the meantime, try our **Recommend** or **Compare** pages to explore real policies!`;
}
