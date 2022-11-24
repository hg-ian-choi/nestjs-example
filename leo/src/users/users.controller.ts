import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() _user: User): Promise<void> {
    return this.usersService.create(_user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') _id: number): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @Delete(':id')
  async remove(@Param('id') _id: number): Promise<void> {
    return this.usersService.remove(_id);
  }
}
