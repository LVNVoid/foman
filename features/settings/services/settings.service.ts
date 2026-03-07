import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { UpdateStoreSettingsInput } from "../schemas/settings.schema";

export const getCachedStoreSettings = unstable_cache(
  async () => {
    return prisma.storeSettings.findFirst({
      select: { storeName: true },
    });
  },
  ["store-settings"],
  { revalidate: 3600, tags: ["settings"] }
);

export async function getStoreSettingsService() {
  let settings = await prisma.storeSettings.findFirst({
    select: {
      id: true,
      storeName: true,
      whatsappNumber: true,
      contactEmail: true,
      contactPhone: true,
      contactAddress: true,
      googleMapsEmbedUrl: true,
      openDays: true,
      openHours: true,
    },
  });

  if (!settings) {
    const created = await prisma.storeSettings.create({
      data: {
        storeName: "Foman Printing",
      },
      select: {
        id: true,
        storeName: true,
        whatsappNumber: true,
        contactEmail: true,
        contactPhone: true,
        contactAddress: true,
        googleMapsEmbedUrl: true,
        openDays: true,
        openHours: true,
      },
    });
    return { success: true, settings: created };
  }

  return { success: true, settings };
}

export async function updateStoreSettingsService(data: UpdateStoreSettingsInput) {
  const settings = await prisma.storeSettings.findFirst({
    select: { id: true },
  });

  if (settings) {
    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: {
        storeName: data.storeName,
        whatsappNumber: data.whatsappNumber,
        contactEmail: data.contactEmail,
        contactPhone: data.whatsappNumber,
        contactAddress: data.contactAddress,
        googleMapsEmbedUrl: data.googleMapsEmbedUrl,
        openDays: data.openDays,
        openHours: data.openHours,
      },
      select: { id: true },
    });
  } else {
    await prisma.storeSettings.create({
      data: {
        storeName: data.storeName,
        whatsappNumber: data.whatsappNumber || "6281234567890",
        contactEmail: data.contactEmail,
        contactPhone: data.whatsappNumber,
        contactAddress: data.contactAddress,
        googleMapsEmbedUrl: data.googleMapsEmbedUrl,
        openDays: data.openDays || "Senin - Jumat",
        openHours: data.openHours || "08:00 - 17:00",
      },
      select: { id: true },
    });
  }
}
