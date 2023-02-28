import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const userInDB = await this.userService.findOneByEmail(email);

    if (!userInDB) {
      throw new NotFoundException('User not found');
    }

    const IsPasswordMatching = await bcrypt.compare(
      password,
      userInDB.password,
    );

    if (!IsPasswordMatching) {
      throw new NotFoundException('Password not matching');
    }

    return IsPasswordMatching;
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const userInDB = await this.userService.findOneByEmail(signinAuthDto.email);
    const payload = {
      firstName: userInDB.firstName,
      lastName: userInDB.lastName,
      email: userInDB.email,
      userId: userInDB.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(signupAuthDto: SignupAuthDto) {
    return await this.userService.create(signupAuthDto);
  }
}
