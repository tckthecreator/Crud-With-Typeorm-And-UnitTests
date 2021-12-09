import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(id);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    await this.userRepository.update(id, { ...updateUserDto });

    const userUpdated = this.userRepository.create({
      ...user,
      ...updateUserDto,
    });

    return userUpdated;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    this.userRepository.remove(user);

    return user;
  }
}
