import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export class Person {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first: string;

  @Column()
  last: string;
}


@Entity()
export class Student extends Person {
  
  @Column()
  class: string;
  
}


@Entity()
export class Teacher extends Person {

  @Column()
  salary: number;

}