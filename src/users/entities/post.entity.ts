import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Tag } from "./tag.entity";



@Entity()
export class Post {
  
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column()
  title: string;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}