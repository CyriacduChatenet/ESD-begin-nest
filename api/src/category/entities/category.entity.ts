import { Post } from 'src/post/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { Timestamp } from '../../utils/timestamp.util';

@Entity()
export class Category extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
