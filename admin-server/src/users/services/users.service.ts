import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.mongo.entity';
import { MongoRepository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.configService.get<string>('database.url');
  }

  async findAll(pagination: PaginationDto) {
    const [data, count] = await this.userRepository.findAndCount({
      order: { name: 'DESC' },
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    });
    return { data, count };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
