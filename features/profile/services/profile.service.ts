import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcrypt";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateProfileInput } from "../schemas/profile.schema";

export async function updateProfileService(data: UpdateProfileInput) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Tidak terotorisasi");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      profileUrl: true,
      profilePublicId: true,
    },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  // Check uniqueness for email and phone number if changed
  if (data.email && data.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existingEmail) {
      throw new Error("Email sudah terdaftar");
    }
  }

  if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
    const existingPhone = await prisma.user.findFirst({
      where: { phoneNumber: data.phoneNumber },
      select: { id: true },
    });
    if (existingPhone) {
      throw new Error("Nomor telepon sudah terdaftar");
    }
  }

  let imageUrl = user.profileUrl;
  let imagePublicId = user.profilePublicId;

  if (data.image && data.image.size > 0) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (error) {
        console.error("Failed to delete old profile image from Cloudinary:", error);
      }
    }

    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "users",
            resource_type: "image",
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  } else if (data.deleteImage) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (error) {
        console.error("Failed to delete profile image from Cloudinary:", error);
      }
    }
    imageUrl = null;
    imagePublicId = null;
  }

  const updateData: any = {
    profileUrl: imageUrl,
    profilePublicId: imagePublicId,
  };
  
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true },
  });
}
