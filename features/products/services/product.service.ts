import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import type { UploadApiResponse } from "cloudinary";
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema";

export async function getProductsService({
  query,
  categoryId,
  page = 1,
  limit = 10,
}: {
  query?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
} = {}) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categoryId && categoryId !== "all") {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        pictures: {
          select: {
            id: true,
            imageUrl: true,
            imagePublicId: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProducts: total,
  };
}

export async function getProductService(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      pictures: {
        select: {
          id: true,
          imageUrl: true,
          imagePublicId: true,
        },
      },
    },
  });
}

export async function getProductBySlugService(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      pictures: {
        select: {
          id: true,
          imageUrl: true,
          imagePublicId: true,
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
          folder: "products",
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

async function generateUniqueSlug(name: string) {
  let slug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.product.findUnique({ where: { slug: uniqueSlug }, select: { id: true } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

export async function createProductService(data: CreateProductInput) {
  const uploadedImages = [];
  
  if (data.images && data.images.length > 0) {
    for (const file of data.images) {
      if (file && file.size > 0) {
        try {
          const uploaded = await uploadImage(file);
          uploadedImages.push({
            imageUrl: uploaded.secure_url,
            imagePublicId: uploaded.public_id,
          });
        } catch (error) {
          console.error(`Image upload failed for ${file.name}:`, error);
          throw new Error(`Image upload failed for ${file.name}`);
        }
      }
    }
  }

  const slug = await generateUniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId || null,
      pictures: {
        create: uploadedImages,
      },
    },
    select: { id: true },
  });

  return product;
}

export async function updateProductService(data: UpdateProductInput) {
  const id = data.id!;
  
  // Handle image deletions
  if (data.deletedImageIds && data.deletedImageIds.length > 0) {
    const imagesToDelete = await prisma.productPicture.findMany({
      where: {
        id: { in: data.deletedImageIds },
        productId: id,
      },
      select: {
        id: true,
        imagePublicId: true,
      },
    });

    for (const image of imagesToDelete) {
      if (image.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(image.imagePublicId);
        } catch (error) {
          console.error(`Failed to delete image from Cloudinary: ${image.imagePublicId}`, error);
        }
      }
    }

    await prisma.productPicture.deleteMany({
      where: {
        id: { in: data.deletedImageIds },
        productId: id,
      },
    });
  }

  // Handle new image uploads
  if (data.images && data.images.length > 0) {
    for (const file of data.images) {
      if (file && file.size > 0) {
        try {
          const uploaded = await uploadImage(file);
          
          await prisma.productPicture.create({
            data: {
              productId: id,
              imageUrl: uploaded.secure_url,
              imagePublicId: uploaded.public_id,
            },
          });
        } catch (error) {
          console.error(`Image upload failed for ${file.name}:`, error);
          throw new Error(`Image upload failed for ${file.name}`);
        }
      }
    }
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    select: { id: true },
  });

  return product;
}

export async function deleteProductService(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      pictures: {
        select: {
          id: true,
          imagePublicId: true,
        },
      },
    },
  });

  if (product) {
    for (const picture of product.pictures) {
      if (picture.imagePublicId) {
        await cloudinary.uploader.destroy(picture.imagePublicId);
      }
    }
    
    await prisma.productPicture.deleteMany({
      where: { productId: id },
    });
  }

  await prisma.product.delete({
    where: { id },
  });
}
