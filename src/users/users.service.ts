import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
    ){}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async createUserAndProfile () {
    const user = await this.userRepository.save({
      email: 'erems@gmail.com',
      password:'mypassword',
    })
    const profile = await this.profileRepository.save({
      profileImg:'helloworld.png',
      user
    })
    return user
  }

  async createPostAndTags() {
    const tag1 = await this.tagRepository.save({
      name: 'code factory nice',
    })
    const tag2 = await this.tagRepository.save({
      name: 'code factory good',
    })

    const post2 = await this.postRepository.save({
      title: 'codefactory',
      tags: [tag1, tag2]
    })
    const post = await this.postRepository.save({
      title: 'inflearn'
    })
  }

  async findTags() {
    return await this.tagRepository.find({
      relations: {
        posts: true
      }
    })
  }

  async findPosts() {
    return await this.postRepository.find({
      relations: {
        tags: true
      }
    })
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        profile: true
      }
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {

    return this.userRepository.update(id, {
      email: updateUserDto.email,
      password: updateUserDto.password
    })
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
