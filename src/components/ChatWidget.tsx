import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessagesSquare, X } from "lucide-react";
import { ChatPanel } from "./chat/ChatPanel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Widget container */}
      <div className="fixed z-50" style={{ bottom: "1.5rem", right: "1.5rem" }}>

        {/* Chat Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={isMobile
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, y: 16, scale: 0.96 }
              }
              animate={isMobile
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: 0, scale: 1 }
              }
              exit={isMobile
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, y: 16, scale: 0.96 }
              }
              transition={isMobile
                ? { type: "spring", stiffness: 300, damping: 30 }
                : { type: "spring", stiffness: 360, damping: 34 }
              }
              // Mobile: slide up from bottom, covers most of screen
              // Tablet+: floating panel anchored to launcher
              className={
                isMobile
                  ? "fixed left-0 right-0 bottom-0 z-50"
                  : "absolute bottom-16 right-0"
              }
              style={
                isMobile
                  ? {
                      height: "90dvh",
                      maxHeight: "90dvh",
                      borderRadius: "20px 20px 0 0",
                      overflow: "hidden",
                    }
                  : {
                      width: "clamp(340px, 92vw, 420px)",
                      height: "clamp(480px, 80vh, 600px)",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }
              }
            >
              <ChatPanel onClose={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher button — always visible */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-chat-launcher"
          aria-label={isOpen ? "Close chat" : "Open chat"}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: "linear-gradient(135deg, #18b3ff 0%, #0e7fd4 100%)",
            boxShadow: isOpen
              ? "0 4px 16px rgba(24,179,255,0.3)"
              : "0 4px 28px rgba(24,179,255,0.5)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.6 }}
              transition={{ duration: 0.16 }}
              className="flex items-center justify-center"
            >
              {isOpen
                ? <X className="w-6 h-6 text-white" strokeWidth={2.2} />
                : <MessagesSquare className="w-6 h-6 text-white" strokeWidth={1.8} />
              }
            </motion.span>
          </AnimatePresence>

          {/* Pulse ring when closed */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: "rgba(24,179,255,0.3)", animationDuration: "2.5s" }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
}
