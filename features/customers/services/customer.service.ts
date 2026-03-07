import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcrypt";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { CustomerInput } from "../schemas/customer.schema";

export async function getCustomersService({
  query,
  page = 1,
  limit = 10,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}) {
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phoneNumber: { contains: query, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profileUrl: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    totalPages,
    totalUsers,
  };
}

export async function getCustomerService(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      profileUrl: true,
      role: true,
      createdAt: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return customer;
}

export async function createCustomerService(data: CustomerInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  let imageUrl = null;
  let imagePublicId = null;

  if (data.image && data.image.size > 0) {
    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "users",
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

    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      profileUrl: imageUrl,
      profilePublicId: imagePublicId,
    },
    select: { id: true },
  });

  return user;
}

export async function updateCustomerService(data: CustomerInput) {
  const id = data.id!;

  const existing = await prisma.user.findUnique({
    where: { id },
    select: {
      profileUrl: true,
      profilePublicId: true,
    },
  });

  if (!existing) throw new Error("User tidak ditemukan");

  let imageUrl = existing.profileUrl;
  let imagePublicId = existing.profilePublicId;

  if (data.image && data.image.size > 0) {
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }

    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "users", resource_type: "image" },
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
  }

  let updateData: any = {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    profileUrl: imageUrl,
    profilePublicId: imagePublicId,
  };

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true },
  });

  return user;
}

export async function deleteCustomerService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      profilePublicId: true,
    },
  });

  if (!user) throw new Error("User tidak ditemukan");

  if (user.profilePublicId) {
    await cloudinary.uploader.destroy(user.profilePublicId);
  }

  await prisma.user.delete({
    where: { id },
  });
}
