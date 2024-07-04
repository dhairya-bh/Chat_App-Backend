import { Exclude } from "class-transformer";
import { Group } from "src/groups/entities/group.entity";
import { Message } from "src/messages/entities/message.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToMany } from "typeorm";

@Entity()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true , unique:true})
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

}