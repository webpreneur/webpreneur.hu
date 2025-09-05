import { promises as fs } from 'fs';
import { Injectable } from '@nestjs/common';
import type { Product } from '@prisma/client';

import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    data: CreateProductRequest,
    userId: number,
  ): Promise<Product> {
    console.log('data:::', data);
    console.log('userId:::', userId);
    console.log('merged data:::', { ...data, userId });

    return await this.prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return Promise.all(
      products.map(async (product) => {
        const imageInfo = await this.#imageExists(product.id);
        return {
          ...product,
          imageExists: imageInfo.exists,
          imageUrl: imageInfo.exists
            ? `/products/${product.id}${imageInfo.extension}`
            : null,
        };
      }),
    );
  }

  async #imageExists(
    productId: number,
  ): Promise<{ exists: boolean; extension?: string }> {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const ext of extensions) {
      try {
        await fs.access(
          join(__dirname, '../../', 'public', 'products', `${productId}${ext}`),
          fs.constants.F_OK,
        );
        return { exists: true, extension: ext };
      } catch {
        // Continue to next extension
      }
    }

    return { exists: false };
  }
}
