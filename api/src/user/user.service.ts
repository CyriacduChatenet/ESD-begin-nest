import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: await encryptedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'post')
        .leftJoinAndSelect('user.comments', 'comment')
        .orderBy('comment.id', 'DESC')
        .getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneById(id: string) {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'post')
        .leftJoinAndSelect('user.comments', 'comment')
        .where('user.id = :id', { id })
        .orderBy('comment.id', 'DESC')
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'post')
        .leftJoinAndSelect('user.comments', 'comment')
        .where('user.email = :email', { email })
        .orderBy('comment.id', 'DESC')
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepository.softDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
