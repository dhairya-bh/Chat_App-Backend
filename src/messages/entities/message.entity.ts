import {
  Entity,
  ManyToOne,
} from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { BaseMessage } from './base-message.entity';


@Entity({ name: 'messages' })
export class Message extends BaseMessage {

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
