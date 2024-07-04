import { Conversation } from 'src/conversations/entities/conversation.entity';
import { GroupMessage } from 'src/groups/entities/group-message.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type CreateUserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ValidateUserDetails = {
  email: string;
  password: string;
};

export type FindUserParams = Partial<{
  userId: string;
  email: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type CreateConversationParams = {
  email: string;
  message: string;
};

export type FindParticipantParams = Partial<{
  id: string;
}>;

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CreateMessageParams = {
  content: string;
  conversationId: string;
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: string;
  conversationId: string ;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type EditGroupMessageParams = {
  groupId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: string;
};

export type CreateGroupMessageParams = {
  groupId: string;
  content: string;
  author: User;
};

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type DeleteGroupMessageParams = {
  userId: string;
  groupId: string;
  messageId: string;
};