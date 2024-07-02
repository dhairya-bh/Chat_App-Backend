/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Services } from '../../utils/constants';
import { User } from 'src/user/entities/user.entity';
import { IUserService } from 'src/user/user';


@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USER)
    private readonly userService: IUserService,
  ) {
    super();
  }
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  async deserializeUser(user: User, done: Function) {
    const userDb = await this.userService.findUser({ userId: user.userId });
    return userDb ? done(null, userDb) : done(null, null);
  }
}