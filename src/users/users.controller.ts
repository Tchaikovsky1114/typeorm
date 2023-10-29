import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/profile')
   createUserAndProfile(){
    return this.usersService.createUserAndProfile(); 
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('/manyusers')
  getManyUsers() {
    return this.usersService.getManyUsers();
  }

  @Post('posts')
  createPosts() {
    return this.usersService.createPostAndTags();
  }

  @Post('tags')
  createPostsTags(){
    return this.usersService.createPostAndTags();
  }

  @Get('tags')
  getTags() {
    return this.usersService.findTags();
  }
  @Get('posts')
  getPosts() {
    return this.usersService.findPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('manyusers')
  createManyUser() {
    return this.usersService.createManyUser();
  }

  @Post('sample')
  sample(){
    return this.usersService.createSample();
  }
}
