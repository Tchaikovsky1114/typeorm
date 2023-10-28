### TYPEORM을 공부하기 위한 레포지토리

HOW?
1. SQL로 생각하며 쿼리 짜기
2. 쿼리 빌더와 연계되는 SQL문을 살펴보기


# COLUMN

## 여러가지 칼럼 데코레이터

### @PrimaryColumn()과 @PrimaryGeneratedColumn()의 차이

- PrimaryColumn은 직접 값을 넣어주어야 한다.


### PrimaryGeneratedColumn은 uuid로 생성할 수 있다.
`PrimaryGeneratedColumn('uuid')`


### @CreateDateColumn(), @UpdateDateColumn()
데이터가 생성,수정되는 날짜와 시간이 자동으로 생성되어 입력된다.

### @VersionColumn()
데이터가 업데이트 될 때마다(`save()` 함수가 몇번 호출되었는지 기록) 1씩 증가한다


### @Generated('increment') 
`@Column`과 같이 사용해야 하며 1씩 자동으로 올라감

### @Generated('uuid)
`@Column`과 같이 사용해야 하며 uuid가 자동으로 입력됨



## 칼럼 데코레이터의 옵션
```ts
  @Entity()
  export class Foo{
  @Column({
    type: 'varchar'
    name: '_title',
    length: 300
    nullable: false
    update: false
    select: true
    default: 'default value',
    unique: false
  })
  title: string;
  type: 'enum',
  enum: Title.NOTICE

}
```
`type`: DB에서 인지하는 칼럼 타입. 기입하지 않아도 자동으로 유추한다.
`name`: 데이터베이스 칼럼 이름 - 프로퍼티의 이름으로 자동 유추되며 해당 옵션을 변경하여 매핑하는 형식으로도 가능하다 (title - _title)
`length`: 입력할 수 있는 값의 길이
`nullable`: nullable
`update`: updatable
`select`: find()를 실행할 때 기본으로 값을 불러올지 결정한다
  - 만약 `select`를 `false`로 입력하였다면, find를 할 때 true로 주어 가져와야한다
```ts
@Injectable()
export class FooService{
  @Get()
  findAll() {
    this.FooRepository.find({
      select: {
        title: true
      }
    })
  }
}
```
=> 위처럼 작성시 select한 값만 가져오게 되므로 주의

`default`: 아무것도 입력하지 않았을 때 기본으로 입력되는 값
`unique`: 해당 테이블의 로우 중 유일무이한 값이 되어야 하는지 결정하는 값. 마치 PrimaryGeneratedColumn()과 같다
`type`, `enum`, `default` : `type`과 `enum` 프로퍼티를 사용하여 ENUM을 지정하고 `default`를 통해 기본 enum을 입력할 수 있다.

```tsx
enum TitleCategory {
  NOTICE = 'notice',
  GENERAL = 'general'
}
  @Column({
    type:'enum',
    enum: TitleCategory,
    default: TitleCategory.GENERAL,
  })
  role: Role

```

# Entity Embedding

```ts
export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}


@Entity()
export class Student {

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  class: string
}


@Entity()
export class Teacher {

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;

}

```
칼럼이 겹친다면 Embed Entity를 통해 중복을 최소화 할 수 있다
Embed Entity는 `@Entity` 데코레이터를 사용하지 않는다.
사용하는 Entity에서 @Column의 인자로서 Embed Entity를 제공해준다

OOP로 상속을 통해 구현할 수도 있다.

## Table Inheritance

```ts
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

```

