import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Product } from '@prisma/client';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { TokenPayload } from 'src/auth/token.payload.interface';
import { CreateProductRequest } from './dto/create-product.request';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':productId/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/products',
        filename: (req, file, callback) => {
          const filename = `${req.params.productId}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Validate file type manually
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // File upload handled by multer storage configuration
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }
}
