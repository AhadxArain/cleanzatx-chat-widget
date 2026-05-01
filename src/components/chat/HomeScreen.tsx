import { MessageCircle, Clock, ChevronRight, X } from "lucide-react";

// CleanzATX brand palette (extracted from cleanzatx.com)
const C = {
  bg: "#070d1b",           // deep navy – website body
  card: "#0e1629",         // slightly lighter for card surfaces
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#18b3ff",       // brand cyan-blue ("Windows." + CTA)
  accentBg: "rgba(24,179,255,0.12)",
  accentHover: "rgba(24,179,255,0.2)",
  text: "#ffffff",
  textMid: "rgba(255,255,255,0.65)",
  textDim: "rgba(255,255,255,0.38)",
  textFaint: "rgba(255,255,255,0.22)",
  online: "#22d3a0",
} as const;

export function HomeScreen({
  onStartChat,
  onViewHistory,
  onClose,
}: {
  onStartChat: () => void;
  onViewHistory: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>

      {/* Header strip */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${C.cardBorder}` }}
      >
        {/* Brand badge */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold tracking-tight"
            style={{ backgroundColor: C.accentBg, color: C.accent }}
          >
            CA
          </div>
          <div>
            <p className="text-[13px] font-bold leading-tight" style={{ color: C.text }}>
              CleanzATX
            </p>
            <p className="text-[10px] leading-tight" style={{ color: C.textDim }}>
              Window &amp; Exterior Cleaning
            </p>
          </div>
        </div>

        {/* Online badge + close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: C.online, boxShadow: `0 0 6px ${C.online}` }}
            />
            <span className="text-[11px] font-semibold" style={{ color: C.online }}>Online</span>
          </div>
          <button
            onClick={onClose}
            data-testid="button-close-home"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{ color: C.textDim }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = C.text;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = C.textDim;
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div
        className="px-5 py-6 shrink-0"
        style={{
          background: `linear-gradient(160deg, rgba(24,179,255,0.06) 0%, transparent 60%)`,
          borderBottom: `1px solid ${C.cardBorder}`,
        }}
      >
        <h2
          className="text-[24px] font-extrabold leading-tight mb-2"
          style={{ color: C.text, letterSpacing: "-0.3px" }}
        >
          How can we{" "}
          <span style={{ color: C.accent }}>help?</span>
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: C.textMid }}>
          Ask about quotes, scheduling, or exterior cleaning services.
        </p>
      </div>

      {/* Action cards */}
      <div className="px-4 pt-4 space-y-2.5 shrink-0">
        <ActionCard
          icon={<MessageCircle className="w-5 h-5" style={{ color: C.accent }} />}
          title="Start a conversation"
          subtitle="Typically replies within a few minutes"
          onClick={onStartChat}
          testId="button-start-conversation"
          accent={C.accent}
          accentBg={C.accentBg}
          accentHover={C.accentHover}
          cardBg={C.card}
          cardBorder={C.cardBorder}
          text={C.text}
          textDim={C.textDim}
          primary
        />
        <ActionCard
          icon={<Clock className="w-5 h-5" style={{ color: C.textMid }} />}
          title="View previous chats"
          subtitle="Pick up where you left off"
          onClick={onViewHistory}
          testId="button-view-history"
          accent={C.accent}
          accentBg="rgba(255,255,255,0.05)"
          accentHover="rgba(255,255,255,0.09)"
          cardBg={C.card}
          cardBorder={C.cardBorder}
          text={C.text}
          textDim={C.textDim}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Service hours block */}
      <div
        className="mx-4 mb-4 rounded-xl p-4 shrink-0"
        style={{ backgroundColor: C.card, border: `1px solid ${C.cardBorder}` }}
      >
        <p className="text-[9px] font-bold tracking-[0.12em] mb-2.5 uppercase" style={{ color: C.accent }}>
          Service Hours
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-[13px] font-semibold" style={{ color: C.text }}>Mon – Fri</p>
          <p className="text-[13px]" style={{ color: C.textMid }}>9:00 – 19:00</p>
        </div>
        <p className="text-[11px] mt-1" style={{ color: C.textDim }}>
          Average reply under 5 minutes
        </p>
      </div>

      {/* Footer */}
      <div className="pb-4 text-center shrink-0">
        <p className="text-[10px] tracking-wide" style={{ color: C.textFaint }}>
          Powered by <span style={{ color: C.accent }}>CleanzATX</span>
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  icon, title, subtitle, onClick, testId,
  accent, accentBg, accentHover, cardBg, cardBorder, text, textDim, primary,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  testId: string;
  accent: string;
  accentBg: string;
  accentHover: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textDim: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="group w-full flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all duration-200"
      style={{
        backgroundColor: accentBg,
        border: primary ? `1px solid rgba(24,179,255,0.3)` : `1px solid ${cardBorder}`,
        boxShadow: primary ? `0 0 0 0 rgba(24,179,255,0)` : "none",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = accentHover;
        if (primary) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px rgba(24,179,255,0.18)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = accentBg;
        if (primary) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 0 rgba(24,179,255,0)`;
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: primary ? "rgba(24,179,255,0.15)" : "rgba(255,255,255,0.07)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold leading-tight" style={{ color: text }}>{title}</p>
        <p className="text-[11px] mt-0.5 leading-tight" style={{ color: textDim }}>
          {subtitle}
        </p>
      </div>
      <ChevronRight
        className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ color: primary ? accent : textDim }}
      />
    </button>
  );
}
