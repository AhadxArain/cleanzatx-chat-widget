import { useState, useRef, useCallback } from "react";
import { Session, Message } from "./types";

function loadSessions(): Session[] {
  try {
    const stored = localStorage.getItem("cleanzatx_chat_history");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToDisk(sessions: Session[]) {
  try {
    localStorage.setItem("cleanzatx_chat_history", JSON.stringify(sessions));
  } catch {
    // ignore quota errors
  }
}

export function useChatStore() {
  // Ref ensures callbacks always read the latest sessions without stale closures
  const sessionsRef = useRef<Session[]>(loadSessions());
  const [sessions, setSessions] = useState<Session[]>(sessionsRef.current);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const commitSessions = useCallback((updated: Session[]) => {
    sessionsRef.current = updated;
    setSessions([...updated]);
    saveToDisk(updated);
  }, []);

  /** Create a brand-new conversation session. */
  const createSession = useCallback((): Session => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: "New Conversation",
      lastUpdated: new Date().toISOString(),
      preview: "",
      messages: [],
    };
    const updated = [newSession, ...sessionsRef.current];
    commitSessions(updated);
    setCurrentSessionId(newSession.id);
    return newSession;
  }, [commitSessions]);

  /** Append a message to a session and bubble it to the top of the list. */
  const addMessage = useCallback((sessionId: string, message: Message) => {
    const current = sessionsRef.current;
    const updated = current.map((s) => {
      if (s.id !== sessionId) return s;
      return {
        ...s,
        lastUpdated: message.timestamp,
        preview: message.text.length > 60
          ? message.text.slice(0, 57) + "…"
          : message.text,
        messages: [...s.messages, message],
      };
    });
    // Move the active session to the top
    const moved = updated.find((s) => s.id === sessionId);
    const rest  = updated.filter((s) => s.id !== sessionId);
    commitSessions(moved ? [moved, ...rest] : updated);
  }, [commitSessions]);

  /** Update the human-readable title of a session (e.g. from the first user message). */
  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    const updated = sessionsRef.current.map((s) =>
      s.id === sessionId ? { ...s, title } : s,
    );
    commitSessions(updated);
  }, [commitSessions]);

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) ?? null;

  return {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    addMessage,
    updateSessionTitle,
  };
}
