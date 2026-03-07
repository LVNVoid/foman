import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateNotificationInput } from "../schemas/notification.schema";

async function getSession() {
  return await getServerSession(authOptions);
}

export async function getNotificationsService(limit = 20) {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return [];

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      isRead: true,
      link: true,
      createdAt: true,
    },
  });
}

export async function getUnreadNotificationCountService() {
  const session = await getSession();
  if (!session?.user?.email) return 0;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return 0;

  return await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  });
}

export async function markNotificationAsReadService(notificationId: string) {
  const session = await getSession();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
    select: { id: true },
  });

  return { success: true };
}

export async function markAllNotificationsAsReadService() {
  const session = await getSession();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return { error: "User not found" };

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}

export async function createNotificationService(data: CreateNotificationInput) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        link: true,
        createdAt: true,
      },
    });

    // Trigger Pusher event
    await pusherServer.trigger(
      `user-${data.userId}`,
      "notification",
      notification
    );

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { error: "Failed to create notification" };
  }
}
