import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ************************************ CREATE ************************************ //
  async create(_user: User): Promise<User> {
    const user = this.usersRepository.create(_user);
    const result = await this.usersRepository.save(user);
    return result;
  }

  // ************************************ READ ************************************ //
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(_id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: _id });
  }

  findByUsername(_username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: _username });
  }

  // ************************************ DELETE ************************************ //
  async remove(_id: number): Promise<void> {
    await this.usersRepository.delete(_id);
  }
}
