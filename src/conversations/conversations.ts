import { User } from 'src/user/entities/user.entity';
import { CreateConversationParams } from '../utils/types';
import { Conversation } from './entities/conversation.entity';

export interface IConversationsService {
  createConversation(
    user: User,
    conversationParams: CreateConversationParams,
  ): Promise<Conversation>;
  getConversations(id: string): Promise<Conversation[]>;
  findConversationById(id: string): Promise<Conversation>;
}