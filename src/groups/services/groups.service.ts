import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../../utils/constants';
import { CreateGroupParams, FetchGroupsParams } from '../../utils/types';
import { IGroupService } from '../interfaces/group';
import { IUserService } from 'src/user/user';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USER)
    private readonly userService: IUserService,
  ) {}

  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;
    const usersPromise = params.users.map((email) =>
      this.userService.findUser({ email }),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    const group = this.groupRepository.create({ users, creator, title });
    return this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .where('user.userId IN (:...users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(id: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent'],
    });
  }

  saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }
}
