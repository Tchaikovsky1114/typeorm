import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Between, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, Not, Repository } from 'typeorm';
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
    // 어떤 프로퍼티를 선택할 지 정의
  getManyUsers() {
    return this.userRepository.find({
    })
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




  async createManyUser() {
    for(let i = 0; i < 100; i++){
      await this.userRepository.save({
        email: `user${i + ''}@gmail.com`,
        password:'mypassword',
        profile: {
          profileImg: `asdf${i}.png`
        }
      })
    }
  }

  async createSample() {
    // 모델에 해당하는 객체 생성. 
    // const user1 = this.userRepository.create({
    //   email:'foo@codefactory.ai',
    //   password: 'mypassword'
    // })
    
    // 생성한 객체를 실제 데이터베이스에 저장

    // await this.userRepository.save(user1);


    // 데이터베이스에 있는 데이터를 불러온 뒤 데이터를 변경하고 객체를 생성
    // create와 마찬가지로 실제 데이터베이스에 저장하지는 않는다.

    // const changeEmail = await this.userRepository.preload({
    //   id: user1.id,
    //   email: 'c@c.c'
    // })

    // await this.userRepository.save(changeEmail)

    // 삭제
    // await this.userRepository.delete(101)

    // 특정 프로퍼티를 증가,감소시키는 메서드
    // 3개의 인자를 받으며, 찾는 조건, 프로퍼티명, 증가할 값을 넣어준다.
    await this.userRepository.increment(
    { id: 99 }, 
    'count',
    100
    )
    // await this.userRepository.decrement(
    //   { id: 1 }, 
    //   'count',
    //   1
    // )

    // 개수 카운팅
    // const count = await this.userRepository.count({
    //     where: {
    //       email: ILike('%0%')
    //     }
    //   })
    
    // 두번째 인자로 넣어준 조건에 맞는 레코드를 순회하며 첫번째 인자로 넣어준 컬럼을 찾아 그 값을 더하여 반환한다.
    // const sum = await this.userRepository.sum('count', {
    //   id: LessThanOrEqual(101)
    // })
    
    // 두번째 인자로 넣어준 조건에 맞는 레코드를 순회하며 첫번째 인자로 넣어준 컬럼을 찾아 평균을 내어 반환한다.
    // const average = await this.userRepository.average('count',{
    //   id: LessThan(10)
    // })

    // const min = await this.userRepository.minimum('count',{
    //   id: LessThanOrEqual(100)
    // })

    // const max = await this.userRepository.maximum('count',{
    //   id:MoreThan(10)
    // })

    

    // return max;
  }
    
}
