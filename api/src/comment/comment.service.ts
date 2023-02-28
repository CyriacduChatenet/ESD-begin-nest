import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}
  create(createCommentDto: CreateCommentDto) {
    try {
      const comment = this.commentRepository.create(createCommentDto);
      return this.commentRepository.save(comment);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .orderBy('comment.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .where('comment.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: string) {
    return await this.commentRepository.softDelete(id);
  }
}
