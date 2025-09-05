import {
  Controller,
  Post,
  UseGuards,
  Res,
  Logger,
  Body,
  Req,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Response, Request } from 'express';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Body() body: any,
    @Req() request: Request,
  ) {
    this.logger.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      `Login endpoint hit with body keys: [${Object.keys(body).join(', ')}]`,
    );
    this.logger.log(
      `Request headers: ${JSON.stringify({
        'content-type': request.headers['content-type'],
        'user-agent': request.headers['user-agent'],
        origin: request.headers.origin,
      })}`,
    );

    return this.authService.login(user, response);
  }
}
