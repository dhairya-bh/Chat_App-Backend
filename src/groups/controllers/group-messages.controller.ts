import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { User } from 'src/user/entities/user.entity';
import { IGroupMessageService } from '../interfaces/group-message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from 'src/messages/dto/edit-message.dto';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroupMessage(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() { content }: CreateMessageDto,
  ) {
    const response = await this.groupMessageService.createGroupMessage({
      author: user,
      groupId: id,
      content,
    });
    this.eventEmitter.emit('group.message.create', response);
    return;
  }

  @Get()
  async getGroupMessages(@AuthUser() user: User, @Param('id') id: string) {
    const messages = await this.groupMessageService.getGroupMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteGroupMessage(
    @AuthUser() user: User,
    @Param('id') groupId: string,
    @Param('messageId') messageId: string,
  ) {
    await this.groupMessageService.deleteGroupMessage({
      userId: user.userId,
      groupId,
      messageId,
    });
    this.eventEmitter.emit('group.message.delete', {
      userId: user.userId,
      messageId,
      groupId,
    });
    return { groupId, messageId };
  }

  @Patch(':messageId')
  async editGroupMessage(
    @AuthUser() { userId }: User,
    @Param('id') groupId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, groupId, messageId };
    const message = await this.groupMessageService.editGroupMessage(params);
    this.eventEmitter.emit('group.message.update', message);
    return message;
  }
}
