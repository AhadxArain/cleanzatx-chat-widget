import { ArrowLeft, X, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Session } from "./types";

// CleanzATX brand palette
const C = {
  bg: "#070d1b",
  card: "#0e1629",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#18b3ff",
  headerBg: "rgba(7,13,27,0.95)",
  text: "#ffffff",
  textMid: "rgba(255,255,255,0.65)",
  textDim: "rgba(255,255,255,0.38)",
} as const;

export function HistoryScreen({
  sessions,
  onSelectSession,
  onBack,
  onClose,
}: {
  sessions: Session[];
  onSelectSession: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ backgroundColor: C.headerBg, borderBottom: `1px solid ${C.cardBorder}`, backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={onBack}
          data-testid="button-back-from-history"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: C.textDim }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = C.text; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textDim; }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <p className="flex-1 text-[14px] font-bold" style={{ color: C.text }}>Previous chats</p>
        <button
          onClick={onClose}
          data-testid="button-close-history"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: C.textDim }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = C.text; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textDim; }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl mb-4"
            style={{ backgroundColor: "rgba(24,179,255,0.08)", border: `1px solid rgba(24,179,255,0.2)` }}
          >
            <MessageSquare className="w-6 h-6" style={{ color: C.accent }} />
          </div>
          <p className="text-[14px] font-semibold mb-1" style={{ color: C.text }}>No conversations yet</p>
          <p className="text-[12px]" style={{ color: C.textDim }}>
            Start a chat and it will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session, i) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              data-testid={`button-session-${session.id}`}
              className="w-full flex flex-col px-5 py-4 text-left transition-all duration-150"
              style={{
                borderBottom: i < sessions.length - 1 ? `1px solid ${C.cardBorder}` : "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[13px] font-semibold truncate" style={{ color: C.text }}>
                  {session.title}
                </span>
                <span className="text-[11px] shrink-0 whitespace-nowrap" style={{ color: C.textDim }}>
                  {formatDistanceToNow(new Date(session.lastUpdated), { addSuffix: true })}
                </span>
              </div>
              <p className="text-[12px] truncate" style={{ color: C.textMid }}>
                {session.preview || "No messages"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
