import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";


@Entity()
export class Tag {

  @PrimaryGeneratedColumn()
  id: number; 

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[]

  @Column()
  name:string;

}