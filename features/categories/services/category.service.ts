import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import type { UploadApiResponse } from "cloudinary";
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { unstable_cache } from "next/cache";

export const getCachedCategory = unstable_cache(
  async (slug: string) => {
    return prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    );
  },
  ["category-detail"],
  { revalidate: 3600, tags: ["categories"] }
);

export async function getCategoriesService() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      imagePublicId: true,
      _count: {
        select: {
          products: true,
        },
      },
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
          folder: "categories",
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

export async function createCategoryService(data: CreateCategoryInput) {
  const slug = slugify(data.name, { lower: true, strict: true });

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  let imageUrl = null;
  let imagePublicId = null;

  if (data.image && data.image.size > 0) {
    try {
      const uploaded = await uploadImage(data.image);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      imageUrl,
      imagePublicId,
    },
    select: { id: true },
  });

  return category;
}

export async function updateCategoryService(data: UpdateCategoryInput) {
  const id = data.id!;
  const slug = data.name ? slugify(data.name, { lower: true, strict: true }) : undefined;

  if (slug) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
      select: { id: true },
    });

    if (existingCategory) {
      throw new Error("Category name already exists");
    }
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      imageUrl: true,
      imagePublicId: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  let imageUrl = category.imageUrl;
  let imagePublicId = category.imagePublicId;

  if (data.deleteImage && category.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(category.imagePublicId);
      imageUrl = null;
      imagePublicId = null;
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  if (data.image && data.image.size > 0) {
    if (imagePublicId && !data.deleteImage) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (error) {
        console.error("Failed to delete old image from Cloudinary:", error);
      }
    }

    try {
      const uploaded = await uploadImage(data.image);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  }

  const updateData: any = {
    imageUrl,
    imagePublicId,
  };
  if (data.name) updateData.name = data.name;
  if (slug) updateData.slug = slug;

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updateData,
    select: { id: true },
  });

  return updatedCategory;
}

export async function deleteCategoryService(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      imagePublicId: true,
    },
  });

  if (category?.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(category.imagePublicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  await prisma.category.delete({
    where: { id },
  });
}
