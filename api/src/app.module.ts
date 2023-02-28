import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_DATABASE_HOST,
      port: parseInt(process.env.POSTGRESQL_DATABASE_PORT),
      username: process.env.POSTGRESQL_DATABASE_USERNAME,
      password: process.env.POSTGRESQL_DATABASE_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PostModule,
    CategoryModule,
    UserModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
