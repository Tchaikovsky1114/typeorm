import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student, Teacher } from './entities/person.entity';
import { Profile } from './entities/profile.entity';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Student,
      Teacher,
      Post,
      Tag
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
