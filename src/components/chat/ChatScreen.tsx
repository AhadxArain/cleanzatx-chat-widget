import { useState, useRef, useEffect } from "react";
import { ArrowLeft, X, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Session } from "./types";

// CleanzATX brand palette
const C = {
  bg: "#070d1b",
  card: "#0e1629",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#18b3ff",
  accentBg: "rgba(24,179,255,0.12)",
  userMsg: "#0e7fd4",       // slightly darker than pure accent for readability
  botMsg: "#0e1629",
  headerBg: "rgba(7,13,27,0.95)",
  inputBg: "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.10)",
  inputFocusBorder: "rgba(24,179,255,0.5)",
  text: "#ffffff",
  textMid: "rgba(255,255,255,0.65)",
  textDim: "rgba(255,255,255,0.38)",
  online: "#22d3a0",
} as const;

export function ChatScreen({
  session,
  isTyping,
  onSendMessage,
  onBack,
  onClose,
}: {
  session: Session | null;
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        onSendMessage(text.trim());
        setText("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ backgroundColor: C.headerBg, borderBottom: `1px solid ${C.cardBorder}`, backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={onBack}
          data-testid="button-back-to-home"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: C.textDim }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = C.text; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textDim; }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[11px] font-extrabold shrink-0"
            style={{ backgroundColor: C.accentBg, color: C.accent }}
          >
            CA
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold leading-tight truncate" style={{ color: C.text }}>CleanzATX</p>
            <p className="flex items-center gap-1.5 text-[11px] leading-tight" style={{ color: C.online }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: C.online, boxShadow: `0 0 5px ${C.online}` }}
              />
              Online · Replies instantly
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          data-testid="button-close-chat"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: C.textDim }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = C.text; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textDim; }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {!session?.messages.length && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl mb-3"
              style={{ backgroundColor: C.accentBg }}
            >
              <SendHorizontal className="w-5 h-5" style={{ color: C.accent }} />
            </div>
            <p className="text-[13px]" style={{ color: C.textDim }}>
              Send a message to get started.
            </p>
          </div>
        )}

        {session?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: `linear-gradient(135deg, ${C.accent} 0%, ${C.userMsg} 100%)`,
                      color: "#fff",
                      borderBottomRightRadius: "5px",
                      boxShadow: "0 2px 12px rgba(24,179,255,0.25)",
                    }
                  : {
                      backgroundColor: C.botMsg,
                      border: `1px solid ${C.cardBorder}`,
                      color: C.textMid,
                      borderBottomLeftRadius: "5px",
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: C.botMsg,
                border: `1px solid ${C.cardBorder}`,
                borderBottomLeftRadius: "5px",
              }}
            >
              {[0, 0.18, 0.36].map((delay, i) => (
                <motion.span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: C.accent }}
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        className="shrink-0 px-3 py-3"
        style={{ borderTop: `1px solid ${C.cardBorder}`, backgroundColor: C.headerBg, backdropFilter: "blur(12px)" }}
      >
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type your message…"
            data-testid="input-chat-message"
            className="flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none transition-all"
            style={{
              backgroundColor: C.inputBg,
              border: `1px solid ${focused ? C.inputFocusBorder : C.inputBorder}`,
              boxShadow: focused ? `0 0 0 3px rgba(24,179,255,0.08)` : "none",
              color: C.text,
            }}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            data-testid="button-send-message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-30"
            style={{
              background: `linear-gradient(135deg, ${C.accent} 0%, ${C.userMsg} 100%)`,
              boxShadow: text.trim() ? "0 2px 12px rgba(24,179,255,0.35)" : "none",
            }}
            onMouseEnter={e => { if (text.trim()) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            <SendHorizontal className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
