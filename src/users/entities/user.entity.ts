import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Post } from "./post.entity";


export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type:'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  // @Column()
  // @Generated('increment') // 1씩 자동으로 올라감
  // additionalId: number;

  // @Column()
  // @Generated('uuid') //uuid가 자동으로 입력됨
  // uuid : number;

  @OneToOne(
    () => Profile,
     (profile) => profile.user,
  // {
  //   eager: true, // find() 호출할 때마다 같이 가져올 relation
  //   cascade: true, // 저장할 때 relation을 동시에 저장 가능하다.
  //   nullable: true, //nullable default: true
  //   // 지웠을 때 발생하는 함수 , no action, cascade: 참조하는 Row도 같이 삭제 , set null => 참조하는 Row에서 참조 id를 null로 변경, set default => 기본 세팅으로 설정 (테이블의 기본 세팅)
  //   // restrict => 해당 프로퍼티를 참조하고 있는 Row가 있는 경우, 삭제 불가
  //   onDelete: 'CASCADE'
  // }
  )
  profile: Profile;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

}
