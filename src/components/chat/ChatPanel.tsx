import { useState } from "react";
import { ChatScreen } from "./types";
import { useChatStore } from "./useChatStore";
import { HomeScreen } from "./HomeScreen";
import { ChatScreen as ChatScreenView } from "./ChatScreen";
import { HistoryScreen } from "./HistoryScreen";

// ─── Config ────────────────────────────────────────────────────────────────────
const WEBHOOK_URL =
  "https://muaziii.app.n8n.cloud/webhook/15e3d9f8-47bd-47de-b6a5-00f1dac4f784";

const WELCOME_MSG =
  "Welcome to CleanzATX! I can help you get a quote, schedule a service, or answer any questions about our window cleaning and exterior services. How can I help you today?";

const FALLBACK_MSG =
  "Sorry, something went wrong on our end. Please try again or reach us directly at (512) 518-0512.";

const REQUEST_TIMEOUT_MS = 20_000;

// ─── n8n payload ───────────────────────────────────────────────────────────────
// Shape sent to the webhook:
//   {
//     sessionId: string,           // stable per conversation
//     message:   string,           // current user message (what n8n "chatInput" expects)
//     history: [                   // prior turns for context
//       { role: "user" | "bot", content: string }
//     ]
//   }
//
// Shape expected back from n8n:
//   { output: string }            // the AI reply — n8n's "Respond to Webhook" node

async function callWebhook(
  sessionId: string,
  message: string,
  history: Array<{ role: "user" | "bot"; content: string }>,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        sessionId,
        message,          // primary field n8n Chat trigger reads as user input
        chatInput: message, // alias — some n8n AI Agent nodes use this key
        history,          // conversation context for the AI
      }),
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.error(`[n8n] HTTP ${res.status} ${res.statusText}`);
      return FALLBACK_MSG;
    }

    // n8n "Respond to Webhook" returns JSON — parse it
    const text = await res.text();
    if (!text.trim()) return FALLBACK_MSG;

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Plain-text response — treat directly as the reply
      return sanitize(text);
    }

    // Extract the reply from the response object.
    // n8n AI Agent → "output" key is standard.
    // Some custom setups use "message", "reply", or "text".
    const reply = extractReply(data);
    return reply || FALLBACK_MSG;
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[n8n] Request timed out");
      return "Our response is taking longer than usual. Please try again or call us at (512) 518-0512.";
    }
    console.error("[n8n] Fetch error", err);
    return FALLBACK_MSG;
  }
}

/** Pull the reply string out of whatever n8n sends back. */
function extractReply(data: unknown): string | null {
  if (typeof data === "string") return sanitize(data);

  if (Array.isArray(data)) {
    // Some n8n setups wrap in an array
    const first = data[0];
    return extractReply(first);
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // Priority: output → message → reply → text → response → content
    for (const key of ["output", "message", "reply", "text", "response", "content"]) {
      if (typeof obj[key] === "string" && (obj[key] as string).trim()) {
        return sanitize(obj[key] as string);
      }
    }
  }

  return null;
}

/** Strip AI chain-of-thought blocks and trim whitespace. */
function sanitize(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "") // DeepSeek / Qwen CoT blocks
    .replace(/^\s+|\s+$/g, "")                 // leading / trailing whitespace
    .trim();
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [screen, setScreen] = useState<ChatScreen>("home");
  const {
    currentSession,
    currentSessionId,
    createSession,
    addMessage,
    setCurrentSessionId,
    updateSessionTitle,
    sessions,
  } = useChatStore();
  const [isTyping, setIsTyping] = useState(false);

  const handleStartConversation = () => {
    const newSession = createSession();
    addMessage(newSession.id, {
      id: crypto.randomUUID(),
      role: "bot",
      text: WELCOME_MSG,
      timestamp: new Date().toISOString(),
    });
    setScreen("chat");
  };

  const handleBack = () => {
    setCurrentSessionId(null);
    setScreen("home");
  };

  const handleSendMessage = async (text: string) => {
    const sid = currentSessionId!;

    // 1. Add user message immediately
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      text,
      timestamp: new Date().toISOString(),
    };
    addMessage(sid, userMsg);

    // 2. Auto-title the session after the first user message
    const session = currentSession;
    if (session && session.title === "New Conversation") {
      const titleText = text.length > 40 ? text.slice(0, 37) + "…" : text;
      updateSessionTitle(sid, titleText);
    }

    // 3. Build history for context (exclude the just-added message — it's the current one)
    const historyMessages = (session?.messages ?? [])
      .filter((m) => m.role === "bot" || m.role === "user")
      .slice(-10) // last 10 turns for context window efficiency
      .map((m) => ({ role: m.role, content: m.text }));

    // 4. Show typing indicator
    setIsTyping(true);

    // 5. Call webhook
    const reply = await callWebhook(sid, text, historyMessages);

    // 6. Hide typing, add bot reply
    setIsTyping(false);
    addMessage(sid, {
      id: crypto.randomUUID(),
      role: "bot",
      text: reply,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div
      data-testid="container-chat-panel"
      className="flex flex-col w-full h-full overflow-hidden sm:rounded-2xl"
      style={{
        backgroundColor: "#070d1b",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(24,179,255,0.12)",
      }}
    >
      {screen === "home" && (
        <HomeScreen
          onStartChat={handleStartConversation}
          onViewHistory={() => setScreen("history")}
          onClose={onClose}
        />
      )}
      {screen === "chat" && (
        <ChatScreenView
          session={currentSession}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
          onClose={onClose}
        />
      )}
      {screen === "history" && (
        <HistoryScreen
          sessions={sessions}
          onSelectSession={(id) => {
            setCurrentSessionId(id);
            setScreen("chat");
          }}
          onBack={() => setScreen("home")}
          onClose={onClose}
        />
      )}
    </div>
  );
}
