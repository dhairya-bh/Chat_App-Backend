import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/user/user';
import { ValidateUserDetails } from 'src/utils/types';
import { compareHash } from 'src/utils/helpers';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findUser(
      { email: userDetails.email },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);

    const valid = await compareHash(userDetails.password, user.password);
    return valid ? user : null;
  }
}
