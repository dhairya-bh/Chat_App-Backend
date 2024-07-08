import { Socket } from 'socket.io';
import { User } from './typeorm/entities/User';

export interface AuthenticatedSocket extends Socket {
  user?: User;
}
