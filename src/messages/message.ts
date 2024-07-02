import { Conversation } from 'src/conversations/entities/conversation.entity';
import { CreateMessageParams, CreateMessageResponse, DeleteMessageParams, EditMessageParams } from '../utils/types';
import { Message } from './entities/message.entity';

export interface IMessageService {
  createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
  getMessagesByConversationId(conversationId: string): Promise<Message[]>;
  deleteMessage(params: DeleteMessageParams);
  editMessage(params: EditMessageParams): Promise<Message>;
}