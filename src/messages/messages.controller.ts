import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { IMessageService } from './message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dto/edit-message.dto';
import { Throttle } from '@nestjs/throttler';

@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Throttle({
    key1: {
      limit: 1,
      ttl: 5,
    },
  })
  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Param('id') conversationId: string,
    @Body()
    { content }: CreateMessageDto,
  ) {
    const params = { user, conversationId, content };
    const response = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.create', response);
    return;
  }

  @Get()
  async getMessagesFromConversation(
    @AuthUser() user: User,
    @Param('id') id: string,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    await this.messageService.deleteMessage({
      userId: user.userId,
      conversationId,
      messageId,
    });

    this.eventEmitter.emit('message.delete', {
      userId: user.userId,
      messageId,
      conversationId,
    });
    return { conversationId, messageId };
  }

  @Patch(':messageId')
  async editMessage(
    @AuthUser() { userId }: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);
    this.eventEmitter.emit('message.update', message);
    return message;
  }
}
