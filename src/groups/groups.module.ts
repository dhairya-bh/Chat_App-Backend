import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';


@Module({
  imports: [],
  controllers: [GroupsController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule {}