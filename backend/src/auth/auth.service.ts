import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './token.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User, response: Response): { tokenPayload: TokenPayload } {
    const expires = new Date();
    const value = this.configService.getOrThrow<string>('JWT_EXPIRATION');
    expires.setMilliseconds(
      expires.getMilliseconds() + ms(value as StringValue),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.getUser({ email });
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
