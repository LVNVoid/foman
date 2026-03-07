import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { CreateBannerInput } from "../schemas/banner.schema";

export async function getBannersService() {
  return await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      imagePublicId: true,
      link: true,
      active: true,
      createdAt: true,
    },
  });
}

export async function getActiveBannersService() {
  return await prisma.banner.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      link: true,
      imagePublicId: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "banners",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      )
      .end(buffer);
  });
}

export async function createBannerService(data: CreateBannerInput) {
  const uploaded = await uploadImage(data.image);

  const banner = await prisma.banner.create({
    data: {
      title: data.title,
      link: data.link,
      active: data.active,
      imageUrl: uploaded.secure_url,
      imagePublicId: uploaded.public_id,
    },
    select: { id: true },
  });

  return banner;
}

export async function deleteBannerService(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id },
    select: {
      id: true,
      imagePublicId: true,
    },
  });

  if (banner?.imagePublicId) {
    await cloudinary.uploader.destroy(banner.imagePublicId);
  }

  await prisma.banner.delete({
    where: { id },
  });
}

export async function toggleBannerActiveService(id: string, active: boolean) {
  const banner = await prisma.banner.update({
    where: { id },
    data: { active },
    select: { id: true },
  });

  return banner;
}
