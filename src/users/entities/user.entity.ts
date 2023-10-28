import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";


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

  @Column()
  @Generated('increment') // 1씩 자동으로 올라감
  additionalId: number;

  @Column()
  @Generated('uuid') //uuid가 자동으로 입력됨
  uuid : number;
}
