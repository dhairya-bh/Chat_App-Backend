import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [{
    provide: Services.USER,
    useClass: UserService,
  },],
  controllers: [UserController],
  exports:[{
    provide: Services.USER,
    useClass: UserService,
  }]
})
export class UserModule {}
