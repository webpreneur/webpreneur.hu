import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: CreateUserRequest,
  ): Promise<Pick<User, 'id' | 'email'>> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: bcrypt.hashSync(data.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists');
      }
      throw error;
    }
  }
}
