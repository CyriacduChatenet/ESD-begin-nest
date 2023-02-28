import { Category } from 'src/category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Timestamp } from '../../utils/timestamp.util';

@Entity()
export class Post extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  published: boolean;

  @ManyToMany(() => Category, (category) => category.posts, {
    cascade: ['insert'],
  })
  @JoinTable()
  categories: Category[];
}
