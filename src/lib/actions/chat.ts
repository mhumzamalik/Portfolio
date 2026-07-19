"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function verifyAdminSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const adminUser = await prisma.adminUser.findUnique({
      where: { authUserId: user.id },
    });

    return adminUser;
  } catch {
    return null;
  }
}

export async function getOrCreateConversationAction(
  visitorId: string,
  visitorName?: string
) {
  if (!visitorId) {
    return { error: "Visitor ID is required." };
  }

  try {
    let conversation = await prisma.conversation.findFirst({
      where: { visitorId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          visitorId,
          visitorName: visitorName || "Anonymous Visitor",
          status: "Open",
        },
        include: {
          messages: true,
        },
      });
    }

    return { success: true, conversation };
  } catch (error: any) {
    console.error("[getOrCreateConversationAction] Error:", error);
    return { error: "Failed to load conversation." };
  }
}

export async function getConversationMessagesAction(conversationId: string) {
  if (!conversationId) {
    return { error: "Conversation ID is required." };
  }

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("[getConversationMessagesAction] Error:", error);
    return { error: "Failed to load messages." };
  }
}

export async function sendChatMessageAction(
  conversationId: string,
  sender: "Visitor" | "Admin",
  content: string
) {
  if (!conversationId || !sender || !content.trim()) {
    return { error: "Invalid parameters." };
  }

  try {
    // If Admin is sending the message, verify session
    if (sender === "Admin") {
      const admin = await verifyAdminSession();
      if (!admin) {
        return { error: "Unauthorized." };
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        sender,
        content: content.trim(),
      },
    });

    // Update conversation's updatedAt timestamp
    // If the sender is the Visitor, automatically reopen the conversation by setting status to "Open"
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        ...(sender === "Visitor" ? { status: "Open" } : {}),
      },
    });

    return { success: true, message };
  } catch (error) {
    console.error("[sendChatMessageAction] Error:", error);
    return { error: "Failed to send message." };
  }
}

export async function getConversationsAction(
  search?: string,
  status?: string
) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  try {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (search && search.trim()) {
      whereClause.visitorName = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("[getConversationsAction] Error:", error);
    return { error: "Failed to load conversations." };
  }
}

export async function closeConversationAction(conversationId: string) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  try {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: "Closed" },
    });

    return { success: true };
  } catch (error) {
    console.error("[closeConversationAction] Error:", error);
    return { error: "Failed to close conversation." };
  }
}
