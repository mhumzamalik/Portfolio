"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { askAiAssistantAction, type AiMessage } from "@/lib/actions/ai";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Tell me about Hamza's experience.",
  "What projects has Hamza built?",
  "What technologies does Hamza specialise in?",
  "How can I hire Hamza?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        <Sparkles className="w-3 h-3" />
      </div>
      <div className="bg-muted border border-border rounded-2xl rounded-tl-none px-3.5 py-2.5 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isSelf = msg.role === "user";
  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} gap-1`}>
      {!isSelf && (
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
            AI Assistant
          </span>
        </div>
      )}
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
          isSelf
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-foreground border border-border rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
    </div>
  );
}

export default function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    const el = messagesEndRef.current;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setShowSuggestions(true);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (text?: string) => {
    const message = (text ?? inputValue).trim();
    if (!message || isLoading) return;

    setInputValue("");
    setError(null);
    setShowSuggestions(false);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Build history for server action (exclude the latest user message we just added)
    const history: AiMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const result = await askAiAssistantAction(history, message);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.reply) {
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: "model",
        content: result.reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[360px] mb-4 bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100dvh - 80px - 56px - 24px - 16px)" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    AI Portfolio Assistant
                  </h3>
                  <span className="text-[9px] font-sans text-muted-foreground block mt-0.5">
                    Ask me anything about Hamza
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 border border-border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-grow overflow-y-auto overscroll-contain p-4 space-y-4 min-h-0 scroll-smooth">
              {messages.length === 0 && showSuggestions && (
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <div className="bg-muted border border-border rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs leading-relaxed text-foreground max-w-[88%]">
                      Hi! I&apos;m Hamza&apos;s AI assistant. I can tell you about his skills, projects, and experience. What would you like to know?
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-1">
                      Suggested questions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSend(prompt)}
                          disabled={isLoading}
                          className="text-[10px] px-2.5 py-1.5 border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 text-muted-foreground hover:text-foreground transition cursor-pointer disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {isLoading && <TypingIndicator />}

              {error && (
                <div className="flex items-center gap-2.5 p-3 bg-rose-500/10 text-rose-400 text-[10px] rounded-xl border border-rose-400/20">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-border/60 bg-muted/20 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about skills, projects..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-grow bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition disabled:opacity-60 placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer outline-none border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
