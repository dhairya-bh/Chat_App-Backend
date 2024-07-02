import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  @Entity({ name: 'group_conversations' })
  export class GroupConversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToMany(() => User, (user) => user.groups)
    users: User[];
  
    @OneToMany(() => Message, (message) => message.conversation, {
      cascade: ['insert', 'remove', 'update'],
    })
    @JoinColumn()
    messages: Message[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: number;
  
    @OneToOne(() => Message)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: Message;
  
    @UpdateDateColumn({ name: 'updated_at' })
    lastMessageSentAt: Date;
  }