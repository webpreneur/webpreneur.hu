import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { Product } from '@prisma/client';

import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { TokenPayload } from 'src/auth/token.payload.interface';
import { CreateProductRequest } from './dto/create-product.request';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<Product> {
    console.log('Controller - raw body:::', body);
    console.log('Controller - user:::', user);
    return await this.productsService.createProduct(body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }
}
