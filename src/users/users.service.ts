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
      profile: {
        profileImg: 'asdf.png'
      }
    })
    // const profile = await this.profileRepository.save({
    //   profileImg:'helloworld.png',
    //   user
    // })
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
    return this.userRepository.find();
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


  // 어떤 프로퍼티를 선택할 지 정의

  getUsers() {
    
    this.userRepository.find({
      // select를 정의하면 정의된 프로퍼티들만 가져온다
      // select: {
      //     email:true,
      //     createdAt:true,

          // 릴레이션된 레코드에서 특정 컬럼만 가져올 수 있음
            // id: true
          // profile: {
            
          // }
      // },
      
      // 필터링 조건 입력, where는 전부 AND 조건으로 묶인다.
      // where: {
      //   id:3,
      // },

      // OR 조건으로 가져오기 위해서는 객체가 아닌 배열로 묶는다.
      // where: [
      //   {
      //     id: 1
      //   },
      //   {
      //     version: 1
      //   }
      // ]

      // relation 된 테이블에서 where를 통해 필터를 걸 수 있다.
      // where: {
      //   profile: {
      //     id: 3
      //   }
      // }
      // 정렬순서를 정할 수 있다.
      // order: {
      //   id: 'ASC'
      // }

      // 반환하는 값에서 number만큼 제외하고 반환한다
      // skip: 5
      
      // 반환하는 값에서 number만큼 가져온다
      // take: 1
    }
    )
    
  }
}
