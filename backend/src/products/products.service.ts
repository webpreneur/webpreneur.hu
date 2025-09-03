import { Injectable } from '@nestjs/common';
import type { Product } from '@prisma/client';

import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }
}
