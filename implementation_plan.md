# Implementation Plan - Real-Time Communication and Live Chat

Add a secure, real-time visitor-to-admin chat system using Supabase Realtime subscriptions and Prisma models.

## User Review Required

> [!IMPORTANT]
> The database schema will be updated to introduce `Conversation` and `Message` models. We will use `npx prisma db push` to synchronize it with Supabase PostgreSQL and execute a raw SQL script to register the tables for Supabase Realtime.

---

## Proposed Changes

### 1. Database Schema

#### [MODIFY] [schema.prisma](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/prisma/schema.prisma)
- Add `Conversation` and `Message` models with relational integrity (cascade delete on message deletion).
- Define indexes on `visitorId`, `status`, `conversationId`, and `createdAt` for optimal query speed.

### 2. Database Push & Realtime Setup

#### [NEW] [enable-realtime.ts](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/scripts/enable-realtime.ts)
- Run a Node.js task to execute SQL queries enabling the tables in the `supabase_realtime` publication:
  ```sql
  alter publication supabase_realtime add table "Message", "Conversation";
  ```

### 3. Server Actions

#### [NEW] [chat.ts](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/lib/actions/chat.ts)
- Implement `getOrCreateConversationAction(visitorId, visitorName)` (Visitor action).
- Implement `sendChatMessageAction(conversationId, sender, content)` (Visitor/Admin action).
- Implement `getConversationsAction(search, status)` (Admin action - validates admin session).
- Implement `getConversationMessagesAction(conversationId)` (Admin/Visitor action).
- Implement `closeConversationAction(conversationId)` (Admin action - validates admin session).

### 4. Redux State Management

#### [MODIFY] [chatSlice.ts](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/lib/store/slices/chatSlice.ts)
- Align slice state with DB models. Keep track of current visitor/admin active room, active message logs, and dynamic realtime message addition.

### 5. Visitor Interface

#### [NEW] [ChatWidget.tsx](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/components/ChatWidget.tsx)
- Create a premium floating chat widget.
- Collect visitor name optionally upon first click, auto-generate `visitorId` and persist in client cookie/localStorage.
- Integrate Supabase browser client Realtime listener (`supabase.channel().on(...)`) to receive admin replies dynamically.

#### [MODIFY] [layout.tsx](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/app/layout.tsx)
- Render `<ChatWidget />` on all public routes (when `isAdmin` is false).

### 6. Admin Interface

#### [NEW] [page.tsx](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/app/admin/chat/page.tsx)
- Add Admin dashboard view at `/admin/chat`.
- Display a split pane showing lists of all active/closed chats and a main message stream panel.
- Allow typing replies, searching chats by visitor name/status, and closing rooms.
- Synchronize list updates in real time using Supabase subscriptions.

#### [MODIFY] [AdminSidebar.tsx](file:///c:/Users/Muhammad%20Hamza/Desktop/internship/portfolio/src/components/admin/AdminSidebar.tsx)
- Add "Live Chat" link to navigation panel with `MessageSquare` icon.

---

## Verification Plan

### Automated Tests
- Ensure Next.js builds properly: `npm run build`
- Type checking: `npx tsc --noEmit`

### Manual Verification
- Open website in two windows (one admin, one visitor).
- Send a message from the widget as a visitor and verify it appears instantly on the Admin Chat dashboard.
- Reply from the admin dashboard and verify it appears instantly in the visitor widget.
- Refresh the pages and ensure the conversation state is restored.
