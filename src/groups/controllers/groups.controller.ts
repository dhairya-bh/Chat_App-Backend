import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { IGroupService } from '../interfaces/group';
import { User } from 'src/user/entities/user.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });
    this.eventEmitter.emit('group.create', group);
    return group;
  }

  @Get()
  async getGroups(@AuthUser() user: User) {
    const data = await this.groupService.getGroups({ userId: user.userId });
    return data;
  }

  @Get(':id')
  getGroup(@AuthUser() user: User, @Param('id') id: string) {
    return this.groupService.findGroupById(id);
  }
}
