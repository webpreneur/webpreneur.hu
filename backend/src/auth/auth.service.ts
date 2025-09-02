import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async verifyUser(email: string, password: string): Promise<any> {
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
