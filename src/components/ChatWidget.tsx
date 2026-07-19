"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addMessage,
  setMessages,
  setLoading,
  setError,
} from "@/lib/store/slices/chatSlice";
import {
  getOrCreateConversationAction,
  sendChatMessageAction,
} from "@/lib/actions/chat";
import { createClient } from "@/lib/supabase/client";
import { toISOStringSafe, formatTime } from "@/lib/utils/date";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, ChevronDown, Loader2 } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [localConversationId, setLocalConversationId] = useState<string | null>(null);

  const messages = useAppSelector((state) => state.chat.messages);
  const isChatLoading = useAppSelector((state) => state.chat.loading);
  const chatError = useAppSelector((state) => state.chat.error);

  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef<any>(null);

  // Initialize unique visitor ID
  useEffect(() => {
    if (typeof window === "undefined") return;

    let visitorId = localStorage.getItem("portfolio_visitor_id");
    if (!visitorId) {
      visitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("portfolio_visitor_id", visitorId);
    }

    const savedName = localStorage.getItem("portfolio_visitor_name");
    if (savedName) {
      setVisitorName(savedName);
      setIsRegistered(true);
    }
  }, []);

  // Fetch or create conversation on open
  useEffect(() => {
    if (!isOpen) return;

    const loadChat = async () => {
      const visitorId = localStorage.getItem("portfolio_visitor_id");
      if (!visitorId || !isRegistered) return;

      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await getOrCreateConversationAction(visitorId, visitorName);

      if (result.error) {
        dispatch(setError(result.error));
        dispatch(setLoading(false));
        return;
      }

      if (result.conversation) {
        setLocalConversationId(result.conversation.id);
        const mappedMessages = (result.conversation.messages || []).map((m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender as "Visitor" | "Admin",
          content: m.content,
          createdAt: toISOStringSafe(m.createdAt),
        }));
        dispatch(setMessages(mappedMessages));
      }
      dispatch(setLoading(false));
    };

    loadChat();
  }, [isOpen, isRegistered, visitorName, dispatch]);

  // Refresh messages every time the chat is opened so state is never stale
  useEffect(() => {
    if (!isOpen || !isRegistered) return;
    const visitorId = localStorage.getItem("portfolio_visitor_id");
    if (!visitorId) return;

    const refresh = async () => {
      const result = await getOrCreateConversationAction(visitorId, visitorName);
      if (result.conversation) {
        setLocalConversationId(result.conversation.id);
        const mapped = (result.conversation.messages || []).map((m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender as "Visitor" | "Admin",
          content: m.content,
          createdAt: toISOStringSafe(m.createdAt),
        }));
        dispatch(setMessages(mapped));
      }
    };
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!localConversationId) return;

    const supabase = createClient();
    supabaseRef.current = supabase;

    const channel = supabase
      .channel(`chat_messages_${localConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${localConversationId}`,
        },
        (payload: any) => {
          const newMsg = payload.new;
          dispatch(
            addMessage({
              id: newMsg.id,
              conversationId: newMsg.conversationId,
              sender: newMsg.sender as "Visitor" | "Admin",
              content: newMsg.content,
              createdAt: toISOStringSafe(newMsg.createdAt),
            })
          );
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [localConversationId, dispatch]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (!messagesEndRef.current) return;
    const el = messagesEndRef.current;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages, isChatLoading]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    localStorage.setItem("portfolio_visitor_name", visitorName.trim());
    setIsRegistered(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !localConversationId) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");

    // Optimistically add the message to Redux
    const tempId = `temp_${Date.now()}`;
    dispatch(
      addMessage({
        id: tempId,
        conversationId: localConversationId,
        sender: "Visitor",
        content: messageContent,
        createdAt: new Date().toISOString(),
      })
    );

    const result = await sendChatMessageAction(
      localConversationId,
      "Visitor",
      messageContent
    );

    if (result.error) {
      dispatch(setError(result.error));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[360px] mb-4 bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100dvh - 80px - 56px - 24px - 16px)" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/60 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Live Support
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-semibold block mt-0.5 animate-pulse">
                    Online
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

            {/* Chat Body – single scroll container */}
            <div
              ref={(el) => {
                // Auto-scroll when the container mounts with existing messages
                if (el && messages.length > 0) {
                  el.scrollTop = el.scrollHeight;
                }
              }}
              className="flex-grow p-4 overflow-y-auto overscroll-contain space-y-4 min-h-0"
            >
              {!isRegistered ? (
                /* Registration Phase */
                <form
                  onSubmit={handleRegister}
                  className="flex flex-col justify-center h-full space-y-4 px-2"
                >
                  <div className="text-center space-y-2 mb-2">
                    <User className="w-8 h-8 mx-auto text-primary" />
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                      Start Conversation
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Please enter your name to start a live conversation with me.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="premium-button-primary w-full py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold cursor-pointer"
                  >
                    Start Chat
                  </button>
                </form>
              ) : isChatLoading ? (
                /* Loading State */
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Loading Conversation...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 px-6">
                  <MessageCircle className="w-8 h-8 text-muted-foreground/40" />
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    No Messages Yet
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Say hello! Send a message to start chatting with me directly.
                  </p>
                </div>
              ) : (
                /* Message List */
                <div className="space-y-3.5">
                  {messages.map((msg) => {
                    const isSelf = msg.sender === "Visitor";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isSelf ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                            isSelf
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted text-foreground border border-border rounded-tl-none"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <span className="text-[8px] text-muted-foreground/75 font-sans mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            {isRegistered && !isChatLoading && (
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-border/60 bg-muted/20 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition"
                  disabled={!localConversationId}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || !localConversationId}
                  className="p-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 rounded-xl transition cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-primary text-primary-foreground border border-primary/20 shadow-2xl rounded-full flex items-center justify-center transition-all cursor-pointer outline-none"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}
