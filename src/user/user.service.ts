import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDetails,
  FindUserOptions,
  FindUserParams,
} from '../utils/types';
import { IUserService } from './user';
import { User } from './entities/user.entity';
import { hashPassowrd } from 'src/utils/helpers';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  indUser(
    findUserParams: Partial<{ userId: string; email: string }>,
    options?: Partial<{ selectAll: boolean }>,
  ): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async createUser(userDetails: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      email: userDetails.email,
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const password = await hashPassowrd(userDetails.password);
    const newUser = this.userRepository.create({ ...userDetails, password });
    return this.userRepository.save(newUser);
  }

  async findUser(
    params: FindUserParams,
    options?: FindUserOptions,
  ): Promise<User> {
    const selections: (keyof User)[] = [
      'email',
      'firstName',
      'lastName',
      'userId',
    ];
    const selectionsWithPassword: (keyof User)[] = [...selections, 'password'];
    const findOptions = {
      where: params,
      select: options?.selectAll ? selectionsWithPassword : selections,
    };

    return this.userRepository.findOne(findOptions);

  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  searchUsers(query: string) {
    const statement = '(user.email ILIKE :query)';
    return this.userRepository
      .createQueryBuilder('user')
      .where(statement, { query: `%${query}%` })
      .limit(10)
      .select(['user.firstName', 'user.lastName', 'user.email', 'user.userId'])
      .getMany();
  }
}
