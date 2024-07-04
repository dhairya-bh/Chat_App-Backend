import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../utils/constants';
import { CreateConversationParams } from '../utils/types';
import { IConversationsService } from './conversations';
import { User } from 'src/user/entities/user.entity';
import { IUserService } from 'src/user/user';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.USER)
    private readonly userService: IUserService,
  ) {}

  async getConversations(id: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .where('creator.userId = :id', { id })
      .orWhere('recipient.userId = :id', { id })
      .orderBy('conversation.lastMessageSentAt', 'DESC')
      .getMany();
  }

  async findConversationById(id: string): Promise<Conversation> {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['lastMessageSent', 'creator', 'recipient'],
    });
  }

  async createConversation(user: User, params: CreateConversationParams) {
    const { email } = params;

    const recipient = await this.userService.findUser({ email });
    if (!recipient)
      throw new HttpException('Recipient not found', HttpStatus.BAD_REQUEST);

    if (user.userId === recipient.userId)
      throw new HttpException(
        'Cannot Create Conversation',
        HttpStatus.BAD_REQUEST,
      );

    const existingConversation = await this.conversationRepository.findOne({
      where: [
        {
          creator: { userId: user.userId },
          recipient: { userId: recipient.userId },
        },
        {
          creator: { userId: recipient.userId },
          recipient: { userId: user.userId },
        },
      ],
    });

    if (existingConversation)
      throw new HttpException('Conversation exists', HttpStatus.CONFLICT);

    const conversation = this.conversationRepository.create({
      creator: user,
      recipient: recipient,
    });

    return this.conversationRepository.save(conversation);
  }
}
