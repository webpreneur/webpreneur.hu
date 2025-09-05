import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User, response: Response): { tokenPayload: TokenPayload } {
    this.logger.log(
      `User login attempt for email: ${user.email}, userId: ${user.id}`,
    );

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

    this.logger.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `User ${user.email} successfully logged in. JWT expires at: ${expires}`,
    );

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string): Promise<User> {
    this.logger.log(`Login verification attempt for email: ${email}`);

    try {
      const user = await this.usersService.getUser({ email });
      if (!user) {
        this.logger.warn(`Login failed: User not found for email: ${email}`);
        throw new UnprocessableEntityException('User not found');
      }

      this.logger.log(`User found for email: ${email}, userId: ${user.id}`);

      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        this.logger.warn(`Login failed: Invalid password for email: ${email}`);
        throw new UnauthorizedException();
      }

      this.logger.log(`Password verification successful for email: ${email}`);
      return user;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof UnprocessableEntityException
      ) {
        throw error; // Re-throw our custom exceptions
      }

      // Log unexpected errors with full details
      this.logger.error(
        `Unexpected error during login verification for email: ${email}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
