"use server";

import { revalidatePath } from "next/cache";
import {
  getNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  createNotificationService,
} from "../services/notification.service";

export async function getNotifications(limit = 20) {
  return await getNotificationsService(limit);
}

export async function getUnreadNotificationCount() {
  return await getUnreadNotificationCountService();
}

export async function markNotificationAsRead(notificationId: string) {
  const result = await markNotificationAsReadService(notificationId);
  revalidatePath("/admin");
  revalidatePath("/");
  return result;
}

export async function markAllNotificationsAsRead() {
  const result = await markAllNotificationsAsReadService();
  revalidatePath("/admin");
  revalidatePath("/");
  return result;
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "ORDER" | "SYSTEM";
  link?: string;
}) {
  return await createNotificationService({ ...data, type: data.type || "INFO" });
}
