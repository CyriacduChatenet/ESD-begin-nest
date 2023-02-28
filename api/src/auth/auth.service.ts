import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const userInDB = await this.userService.findOneByEmail(signinAuthDto.email);

    if (!userInDB) {
      throw new NotFoundException('User not found');
    }

    const IsPasswordMatching = await bcrypt.compare(
      signinAuthDto.password,
      userInDB.password,
    );

    if (!IsPasswordMatching) {
      throw new UnauthorizedException('auth required');
    }

    const payload = {
      firstName: userInDB.firstName,
      lastName: userInDB.lastName,
      email: userInDB.email,
      password: userInDB.password,
      userId: userInDB.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupAuthDto: SignupAuthDto) {
    return await this.userService.create(signupAuthDto);
  }
}
