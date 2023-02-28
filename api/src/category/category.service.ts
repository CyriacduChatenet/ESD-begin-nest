import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'posts')
      .getMany();
  }

  async findOne(id: string) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'posts')
      .where('category.id = :id', { id })
      .getOne();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryRepository.softDelete(id);
  }
}
