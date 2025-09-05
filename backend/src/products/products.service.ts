import { promises as fs } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from '@prisma/client';
import { join } from 'path';

import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { PRODUCT_IMAGES } from './product-images';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    data: CreateProductRequest,
    userId: number,
  ): Promise<Product> {
    return await this.prismaService.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany();
    return Promise.all(
      products.map(async (product) => {
        const imageInfo = await this.#imageExists(product.id);
        return {
          ...product,
          imageExists: imageInfo.exists,
          imageUrl: imageInfo.exists
            ? `/images/products/${product.id}${imageInfo.extension}`
            : null,
        };
      }),
    );
  }

  async getProduct(
    productId: number,
  ): Promise<Product & { imageExists: boolean; imageUrl: string | null }> {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: {
            id: productId,
          },
        })),
        imageExists: (await this.#imageExists(productId)).exists,
        imageUrl: (await this.#imageExists(productId)).exists
          ? `/images/products/${productId}${(await this.#imageExists(productId)).extension}`
          : null,
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Product "${productId}" id not found`);
    }
  }

  async #imageExists(
    productId: number,
  ): Promise<{ exists: boolean; extension?: string }> {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const ext of extensions) {
      // Check both lowercase and uppercase extensions
      for (const extension of [ext.toLowerCase(), ext.toUpperCase()]) {
        try {
          await fs.access(
            join(`${PRODUCT_IMAGES}/${productId}${extension}`),
            fs.constants.F_OK,
          );
          return { exists: true, extension };
        } catch {
          // Continue to next extension
        }
      }
    }

    return { exists: false };
  }
}
