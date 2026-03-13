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
        minPrice: true,
        maxPrice: true,
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
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            unit: true,
          },
          orderBy: { name: 'asc' },
        },
        specifications: {
          select: {
            id: true,
            key: true,
            value: true,
          },
          orderBy: { key: 'asc' },
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
      minPrice: true,
      maxPrice: true,
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
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          unit: true,
        },
        orderBy: { name: 'asc' },
      },
      specifications: {
        select: {
          id: true,
          key: true,
          value: true,
        },
        orderBy: { key: 'asc' },
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
      minPrice: true,
      maxPrice: true,
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
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          unit: true,
        },
        orderBy: { name: 'asc' },
      },
      specifications: {
        select: {
          id: true,
          key: true,
          value: true,
        },
        orderBy: { key: 'asc' },
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

  const productCreateInput: any = {
    name: data.name,
    slug,
    description: data.description,
    minPrice: data.minPrice ?? null,
    maxPrice: data.maxPrice ?? null,
    categoryId: data.categoryId || null,
    pictures: {
      create: uploadedImages,
    },
    variants: data.variants && data.variants.length > 0 ? {
      create: data.variants.map(v => ({
        name: v.name,
        price: v.price,
        stock: v.stock,
        unit: v.unit || null,
      }))
    } : undefined,
    specifications: data.specifications && data.specifications.length > 0 ? {
      create: data.specifications.map(s => ({
        key: s.key,
        value: s.value,
      }))
    } : undefined,
  };

  const [product] = await prisma.$transaction([
    prisma.product.create({
      data: productCreateInput,
      select: { id: true },
    })
  ]);

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
  }

  // Identify new image uploads (external Cloudinary call)
  const newUploadedPictures = [];
  if (data.images && data.images.length > 0) {
    for (const file of data.images) {
      if (file && file.size > 0) {
        try {
          const uploaded = await uploadImage(file);
          newUploadedPictures.push({
            productId: id,
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

  // Build Transaction Array
  const transactionOperations = [];

  // 1. Delete DB rows for old images
  if (data.deletedImageIds && data.deletedImageIds.length > 0) {
    transactionOperations.push(
      prisma.productPicture.deleteMany({
        where: {
          id: { in: data.deletedImageIds },
          productId: id,
        },
      })
    );
  }

  // 2. Create DB rows for new images
  if (newUploadedPictures.length > 0) {
    transactionOperations.push(
      prisma.productPicture.createMany({
        data: newUploadedPictures,
      })
    );
  }

  // 3. Update core product stats, replacing variants/specs atomically
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.minPrice !== undefined) updateData.minPrice = data.minPrice ?? null;
  if (data.maxPrice !== undefined) updateData.maxPrice = data.maxPrice ?? null;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;

  if (data.variants !== undefined) {
    updateData.variants = {
      deleteMany: {},
      create: data.variants.map(v => ({
        name: v.name,
        price: v.price,
        stock: v.stock,
        unit: v.unit || null,
      })),
    };
  }
  
  if (data.specifications !== undefined) {
    updateData.specifications = {
      deleteMany: {},
      create: data.specifications.map(s => ({
        key: s.key,
        value: s.value,
      })),
    };
  }

  transactionOperations.push(
    prisma.product.update({
      where: { id },
      data: updateData,
      select: { id: true, slug: true },
    })
  );

  const results = await prisma.$transaction(transactionOperations);
  return results[results.length - 1] as { id: string; slug: string; }; // Return the product
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
