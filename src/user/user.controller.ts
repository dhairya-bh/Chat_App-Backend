import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Query,
  } from '@nestjs/common';
  import { Routes, Services } from '../utils/constants';
  import { IUserService } from './user';
  
  @Controller(Routes.USER)
  export class UserController {
    constructor(
      @Inject(Services.USER) private readonly userService: IUserService,
    ) {}
  
    @Get('search')
    searchUsers(@Query('query') query: string) {
      if (!query)
        throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
      return this.userService.searchUsers(query);
    }
  }