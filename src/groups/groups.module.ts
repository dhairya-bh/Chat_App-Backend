import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { GroupMessageController } from './controllers/group-messages.controller';
import { GroupMessageService } from './services/group-messages.service';
import { GroupMessage } from './entities/group-message.entity';
import { Group } from './entities/group.entity';
import { UserModule } from 'src/user/user.module';
import { GroupController } from './controllers/groups.controller';
import { GroupService } from './services/groups.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Group, GroupMessage])],
  controllers: [GroupController, GroupMessageController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {}