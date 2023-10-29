# TYPEORM을 공부하기 위한 레포지토리

___

<br/>
<br/>
<br/>

# 1.COLUMN

## 여러가지 칼럼 데코레이터

### @PrimaryColumn()과 @PrimaryGeneratedColumn()의 차이

- PrimaryColumn은 직접 값을 넣어주어야 한다.

<br/>
<br/>

### PrimaryGeneratedColumn은 uuid로 생성할 수 있다.
`PrimaryGeneratedColumn('uuid')`

<br/>
<br/>

### @CreateDateColumn(), @UpdateDateColumn()
데이터가 생성,수정되는 날짜와 시간이 자동으로 생성되어 입력된다.

<br/>
<br/>


### @VersionColumn()
데이터가 업데이트 될 때마다(`save()` 함수가 몇번 호출되었는지 기록) 1씩 증가한다

<br/>
<br/>

### @Generated('increment') 
`@Column`과 같이 사용해야 하며 1씩 자동으로 올라감

<br/>
<br/>

### @Generated('uuid)
`@Column`과 같이 사용해야 하며 uuid가 자동으로 입력됨

<br/>
<br/>


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

`select`: find()를 실행할 때 기본으로 값을 불러올지 결정한다.

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

<br/>

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

# 2. Entity Embedding

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

___

</br>
</br>
</br>

# 3. Relation


## ONE TO ONE

하나의 테이블이 다른 하나의 테이블과 관계를 맺는 구조

### 예시. User & Table Entity

```ts

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

}

@Entity()
export class Profile {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

}

```

### `@OneToOne`

- 테이블을 서로 매핑하는 데코레이터

### `@JoinColumn`

- 일대일 관계에서 관계의 **소유자** 측을 지정하는 데 사용되는 데코레이터.
- 위 예제에서는 `user`와 `profile` 관계에서 `user` 프로퍼티에 `@JoinColumn` 데코레이터를 사용함으로서 `user` 테이블이 소유자측임을 나타내고 있다.


</br>
</br>
</br>


## OneToMany, ManyToOne

- `@OneToMany` 관계는 **One**의 입장에서 본 관계로, 하나가 다수를 소유하는 관계이다.
- `@ManyToOne` 관계는 **Many**의 입장에서 본 관계로, 다수가 하나를 가리키는 관계이다.


### <>To<>가 결정되는 과정

1. 유저는 자신의 레코드에 **하나 이상의 포스트를 가질 수 있기에** 유저가 바라보는 포스트와의 관계는 <>To**Many** 관계가 된다.
2. 포스트는 자신의 레코드에 **하나를 초과한 유저를 가질 수 없기에** 포스트가 바라보는 유저와의 관계는 <>To**One** 관계가 된다.
3. (하나의 유저가 여러개의 포스트를 가질 수 있음을 확인하였기에) 포스트의 관점에서 유저와의 관계는 ManyToOne 관계가 된다.
4. (하나의 포스트가 여러개의 유저를 가질 수 없음을 확인하였기에) 유저의 관점에서 포스트와의 관계는 OneToMany 관계가 된다.

1번의 조건으로 바로 OneToMany 관계라고 말할 수 없는 것은 다른 유저 레코드가 자신과 같은 포스트를 가질 수 있는지 확인할 수 없기 때문이다.

관계를 확정하였다면,

1. `One`의 레코드에 `@OneToMany` 데코레이터를 사용한다. 이때 데코레이터를 받는 프로퍼티는 레코드가 소유하는 `Many`를 가르킬 수 있어야 한다.(posts)
2. `Many`가 되는 레코드에 `@ManyToOne` 데코레이터를 사용한다. 이때 데코레이터를 받는 프로퍼티는 자신을 소유하는 `One`을 가르킬 수 있어야 한다.(author)
3. 사용한 데코레이터의 첫 번째 인수로 프로퍼티가 어떤 타입을 갖는지 입력하고 두 번째 인수로는 서로를 가리키는 프로퍼티명을 입력한다.


```ts

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

}

@Entity()
export class Post {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}

```

</br>
</br>
</br>

## ManyToMany

관계를 맺는 레코드가 서로의 레코드를 다수로 가질 수 있는 관계를 말한다.
ManyToMany의 관계에서는 중개테이블을 생성해야 하지만 TypeORM의 도움으로 `@JoinTable` 데코레이션으로 쉽게 구현할 수 있다.


### 예시. Post와 Tag

여기서도 위에서 사용한 <>TO<>가 결정되는 과정 알고리즘을 사용한다.

1. 포스트는 자신의 레코드에 **하나 이상의 태그를 가질 수 있기에** 포스트가 바라보는 테그와의 관계는 <>To**Many** 관계가 된다.
2. 테그는 자신의 레코드에 **하나를 초과한 포스트를 가질 수 있기에** 테그가 바라보는 포스트와의 관계는 <>To**Many** 관계가 된다.
3. (하나의 테그가 여러개의 포스트를 가질 수 있음을 확인하였기에) 테그의 관점에서 포스트와의 관계는 ManyToMany 관계가 된다.
4. (하나의 포스트가 여러개의 태그를 가질 수 있음을 확인하였기에) 포스트의 관점에서 테그와의 관계는 ManyToMany 관계가 된다.



```ts
@Entity()
export class Post {
  
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}


@Entity()
export class Tag {

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[]
}

```

### `@JoinTable`

ManyToMany 관계를 설정할 때 관련 엔티티 간의 연결 테이블을 정의하는 데 사용된다.


___

<br/>
<br/>

# Relation Options 

옵션은 OneToOne, OneToMany, ManyToOne, ManyToMany 모두 같은 옵션을 사용한다.

```ts
@OneToOne(
  () => Foo,
  (foo) => foo.bar,
  {
    eager: true,
    cascade: false,
    nullable: true,
    onDelete: 'CASCADE'
  })
```

`eager`: `find()` 메서드를 호출할 때마다 연결되어 있는 relation을 모두 가져온다.
`cascade`: `save()`를 호출할 때 relation을 같이 생성하여 저장할 수 있게 한다.
`nullable`: nullable.
`onDelete`: 해당 로우가 삭제 되었을 때 호출되는 추가 SQL문을 ENUM으로 정의
  - NOACTION : 아무것도 실행하지 않음
  - CASCADE: 해당 테이블을 참조하고 있는 ROW도 같이 삭제
  - SETNULL: 참조하고 있는 ROW에서 해당 테이블 ID를 null로 변경
  - SETDEFAULT: 테이블의 기본 세팅으로 설정
  - RESTRICT: 해당 테이블을 참조하고 있는 다른 로우가 있는 경우, 삭제 불가


## FindManyOptions
`find()` 메서드를 사용할 때 인자로 넣을 수 있는 옵션을 뜻한다
FindManyOptions는 FineOneOptions를 상속받는다.


```ts
  FindManyOptions.d.ts
  export interface FindManyOptions<Entity = any> extends FindOneOptions<Entity> {
    skip?: number;
    take?: number;
}
```

  자주 쓰이는 옵션은 다음과 같다.

```ts
  this.userRepository.find({
        select: {
            email:true,
            createdAt:true,
            id: true,
            profile: {
              id: true
            }
        },
        // where 1.
        where: {
          id:3,
        },
        // where 2.
        where: [
          {
            id: 1
          },
          {
            version: 1
          }
        ],
        // where 3.
        where: {
          profile: {
            id: 3
          }
        },
        order: {
          id: 'ASC'
        },
        skip: 5,
        take: 1
    })
```
`select`: 정의된 프로퍼티들만 가져오는데, 릴레이션된 레코드를 입력하여 가져올수도 있고, 또 릴레이션된 레코드 내부의 특정 프로퍼티만 가져올 수도 있다.
<br/>
<br/>
`where`:ANDwhere와 ORwhere가 존재한다.
  1. AND는 `{}`로 묶는다
  2. OR은 `[]`로 묶는다.
  3. 만약 릴레이션된 레코드가 존재한다면 관계를 맺는 테이블을 where절 안에 넣어 필터링 할 수 있다.

`order`: 정렬순서를 정할 수 있다.
<br/>

`skip`: 반환하는 값의 첫 인덱스부터 입력한 숫자만큼 제외하여 반환한다.
<br/>

`take`: 반환하는 값의 첫 인덱스부터 입력한 숫자만큼 가져온다.
<br/>

<br/><br/><br/>

## FindOperator

특정 조건을 만족하는 값을 찾기 위한 도움을 주는 유틸리티를 의미한다.

```ts

this.userRepository.find({
      where: {
        아닌 경우 가져오기
        id: Not(1),
        
        
        id: LessThan(30), LessThanOrEqual(30), MoreThan(30), MoreThanOrEqual(30)

        
        email: Like('%gmail%')

        유사값. 대소문자를 구분하지 않는다
        email: ILike('%GmAiL%')

        사이값
        id: Between(10, 15)

        해당되는 여러개의 값
        id: In([1,3,5,7,99])

        해당 프로퍼티가 null인 경우 가져온다
        id: IsNull()
        
      }
    })

```

`Not`: 인자에 들어오는 값이 아닌 레코드를 찾아 반환한다
`LessThan`, `LessThanOrEqual`, `MoreThan`, `MoreThanOrEqual`: `<` , `<=`, `>` , `>=`
`Like`: 유사값. 찾고자 하는 값을 기준으로 퍼센트를 위치시킨다. 퍼센트는 해당 위치에 어떤 값이 있든지 상관하지 않고 조건에 맞는 값을 반환한다
`ILike`: `Like`와 같으나 대소문자를 가리지 않는다
`Between`: 사이값을 반환한다
`In`: 인자로 배열을 받으며 배열 내 값을 반환한다
`IsNull`: IsNull

