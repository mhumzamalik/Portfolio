"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toISOStringSafe, formatTime } from "@/lib/utils/date";
import {
  setConversations,
  updateConversationLastMessage,
  setMessages,
  addMessage,
  setActiveConversationId,
  setLoading,
  setError,
  closeConversationInState,
} from "@/lib/store/slices/chatSlice";
import {
  getConversationsAction,
  getConversationMessagesAction,
  sendChatMessageAction,
  closeConversationAction,
} from "@/lib/actions/chat";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Send,
  MessageSquare,
  X,
  Loader2,
  AlertCircle,
  Inbox,
  User,
  CheckCircle,
} from "lucide-react";

export default function AdminChatPage() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const messages = useAppSelector((state) => state.chat.messages);
  const activeId = useAppSelector((state) => state.chat.activeConversationId);
  const isLoading = useAppSelector((state) => state.chat.loading);
  const chatError = useAppSelector((state) => state.chat.error);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Open" | "Closed" | "All">("Open");
  const [inputMessage, setInputMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);

  // Sync ref with state for realtime listener closure
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Initial fetch of conversations
  const loadConversations = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const result = await getConversationsAction(
      undefined,
      statusFilter === "All" ? undefined : statusFilter
    );

    if (result.error) {
      dispatch(setError(result.error));
      dispatch(setLoading(false));
      return;
    }

    if (result.conversations) {
      const mappedConversations = result.conversations.map((c: any) => ({
        id: c.id,
        visitorId: c.visitorId,
        visitorName: c.visitorName,
        status: c.status,
        createdAt: toISOStringSafe(c.createdAt),
        updatedAt: toISOStringSafe(c.updatedAt),
        messages: (c.messages || []).map((m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender,
          content: m.content,
          createdAt: toISOStringSafe(m.createdAt),
        })),
      }));
      dispatch(setConversations(mappedConversations));
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    loadConversations();
  }, [statusFilter]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId) {
      dispatch(setMessages([]));
      return;
    }

    const loadMessages = async () => {
      const result = await getConversationMessagesAction(activeId);
      if (result.error) {
        dispatch(setError(result.error));
        return;
      }
      if (result.messages) {
        const mappedMessages = result.messages.map((m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender,
          content: m.content,
          createdAt: toISOStringSafe(m.createdAt),
        }));
        dispatch(setMessages(mappedMessages));
      }
    };

    loadMessages();
  }, [activeId]);

  // Realtime subscription setup
  useEffect(() => {
    const supabase = createClient();

    // Listen to new messages
    const messageChannel = supabase
      .channel("admin_messages_feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
        },
        (payload: any) => {
          const newMsg = payload.new;
          const serializedMsg = {
            id: newMsg.id,
            conversationId: newMsg.conversationId,
            sender: newMsg.sender,
            content: newMsg.content,
            createdAt: toISOStringSafe(newMsg.createdAt),
          };

          // If message belongs to active conversation, add it to Redux messages
          if (serializedMsg.conversationId === activeIdRef.current) {
            dispatch(addMessage(serializedMsg));
          }

          // Update last message in the conversation list
          dispatch(
            updateConversationLastMessage({
              conversationId: serializedMsg.conversationId,
              message: serializedMsg,
            })
          );
        }
      )
      .subscribe();

    // Listen to changes in Conversations list (e.g. status changes, new rooms created)
    const conversationChannel = supabase
      .channel("admin_conversations_feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Conversation",
        },
        () => {
          // Simplest, most bulletproof sync is to reload the active list
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!messagesEndRef.current) return;
    const el = messagesEndRef.current;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeId) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");

    // Optimistically add message
    const tempId = `temp_${Date.now()}`;
    dispatch(
      addMessage({
        id: tempId,
        conversationId: activeId,
        sender: "Admin",
        content: messageContent,
        createdAt: new Date().toISOString(),
      })
    );

    const result = await sendChatMessageAction(activeId, "Admin", messageContent);

    if (result.error) {
      dispatch(setError(result.error));
    }
  };

  const handleCloseConversation = async () => {
    if (!activeId) return;

    startTransition(async () => {
      const result = await closeConversationAction(activeId);
      if (result.error) {
        dispatch(setError(result.error));
        return;
      }
      dispatch(closeConversationInState(activeId));
      dispatch(setActiveConversationId(null));
      loadConversations();
    });
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    return (c.visitorName || "Anonymous")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="serif-title text-2xl text-foreground font-semibold">
            Live Chat Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage real-time support requests and communicate with active site visitors.
          </p>
        </div>
      </div>

      {chatError && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 text-rose-400 text-xs rounded-xl border border-rose-400/20 flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{chatError}</span>
        </div>
      )}

      {/* Workspace Panel */}
      <div className="flex-grow flex border border-border/80 rounded-2xl overflow-hidden bg-card/50 shadow-sm min-h-0">

        {/* Left Pane - Conversations List */}
        <div className="w-80 border-r border-border/80 flex flex-col bg-card/75">
          {/* Filters & Search */}
          <div className="p-4 border-b border-border/60 space-y-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search visitors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none focus:border-primary/50 transition"
              />
            </div>

            <div className="flex gap-1.5 p-0.5 bg-muted rounded-lg text-xs font-semibold">
              {(["Open", "Closed", "All"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-1.5 rounded-md transition text-center uppercase tracking-wider text-[9px] cursor-pointer ${statusFilter === status
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* List Scroll Area */}
          <div className="flex-grow overflow-y-auto divide-y divide-border/40 min-h-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Loading chats...
                </span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4 space-y-1.5">
                <Inbox className="w-6 h-6 text-muted-foreground/45" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  No Conversations
                </span>
                <span className="text-[10px] text-muted-foreground">
                  No active queries match your criteria.
                </span>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeId;
                const lastMsg = conv.messages && conv.messages[0];
                return (
                  <button
                    key={conv.id}
                    onClick={() => dispatch(setActiveConversationId(conv.id))}
                    className={`w-full p-4 text-left transition flex flex-col gap-1 border-l-2 cursor-pointer ${isActive
                        ? "bg-primary/5 border-primary"
                        : "border-transparent hover:bg-muted/40"
                      }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xs font-bold text-foreground truncate max-w-[70%]">
                        {conv.visitorName || "Anonymous Visitor"}
                      </span>
                      <span className="text-[9px] text-muted-foreground/75 font-sans">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                    {lastMsg && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1 break-all">
                        {lastMsg.sender === "Admin" ? "You: " : ""}{lastMsg.content}
                      </p>
                    )}
                    <span
                      className={`self-start text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold mt-1 ${conv.status === "Open"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {conv.status}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 flex flex-col bg-card/40">
          {activeConversation ? (
            <>
              {/* Top Meta Header */}
              <div className="p-4 border-b border-border/60 bg-muted/10 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                      {activeConversation.visitorName || "Anonymous Visitor"}
                    </h3>
                    <p className="text-[9px] text-muted-foreground mt-0.5 font-sans">
                      Visitor ID: {activeConversation.visitorId}
                    </p>
                  </div>
                </div>

                {activeConversation.status === "Open" && (
                  <button
                    onClick={handleCloseConversation}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-xl text-[10px] uppercase font-bold text-amber-500 hover:bg-amber-500/10 transition cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    <span>Close Chat</span>
                  </button>
                )}
              </div>

              {/* Messages Stream – single scroll container */}
              <div
                className="flex-grow p-4 overflow-y-auto overscroll-contain space-y-3.5 min-h-0 pr-2"
              >
                {messages.map((msg) => {
                  const isSelf = msg.sender === "Admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs ${
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

              {/* Input panel */}
              {activeConversation.status === "Open" ? (
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-border/60 bg-muted/20 flex gap-2 flex-shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-3 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 rounded-xl transition cursor-pointer flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-border/60 bg-muted/30 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex-shrink-0">
                  This conversation has been closed.
                </div>
              )}
            </>
          ) : (
            /* Selected Active State Mock */
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-2">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 animate-bounce" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Select a Chat
              </h3>
              <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                Choose a conversation from the left sidebar to start responding to visitors in real time.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
