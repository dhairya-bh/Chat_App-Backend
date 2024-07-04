import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  
  export abstract class BaseMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text',{nullable:true})
    content: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: number;
  
    @ManyToOne(() => User, (user) => user.messages)
    author: User;
  }