import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = await this.postRepository.create(createPostDto);
    return await this.postRepository.save(newPost);
  }

  async findAll() {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('post.id = :id', { id })
      .getOne();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    return await this.postRepository.softDelete(id);
  }
}
