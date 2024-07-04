import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { MessagingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { GroupModule } from 'src/groups/groups.module';

@Module({
  imports:[ConversationsModule,GroupModule],
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}