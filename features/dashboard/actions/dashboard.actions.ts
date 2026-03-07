"use server";

import { getDashboardStatsService } from "../services/dashboard.service";

export async function getDashboardStats() {
  return await getDashboardStatsService();
}
