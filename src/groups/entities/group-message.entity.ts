import { BaseMessage } from 'src/messages/entities/base-message.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Group } from './group.entity';


@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;
}