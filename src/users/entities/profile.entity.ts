import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Profile {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column()
  profileImg: string;

}

