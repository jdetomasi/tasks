import { AccessToken } from './interfaces/access-token.interface';
import { User, UserDocument } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    if (!username || !password) return null;

    const user = await this.userService.findByUsername(username);

    if (user?.password) {
      const passwordMatch =
        password && (await bcrypt.compare(password, user.password));

      if (passwordMatch) {
        const { password, ...ret } = user;
        return ret;
      }
    }

    return null;
  }

  async login(user: UserDocument): Promise<AccessToken> {
    const payload = {
      username: user.username,
      userId: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
