import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Student, Teacher } from './users/entities/person.entity';
import { Profile } from './users/entities/profile.entity';
import { Post } from './users/entities/post.entity';
import { Tag } from './users/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      database:'postgres',
      password:'postgres',
      username: 'postgres',
      host: '127.0.0.1',
      port:1234,
      entities: [User,Teacher,Student,Profile,Post,Tag],
      synchronize: true,
    }),
    UsersModule
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
