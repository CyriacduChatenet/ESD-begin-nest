import { User } from 'src/user/entities/user.entity';

export class CreatePostDto {
  title: string;
  content: string;
  user: User;
}
