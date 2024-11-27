import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-params.dto';
import { get } from 'http';
import { isInstance } from 'class-validator';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?')
  /**
   * Handles GET requests to the '/users' endpoint.
   *
   * @param id - Optional parameter 'id' extracted from the route.
   * @param limit - Optional query parameter 'limit' to limit the number of users.
   * @returns A string indicating a GET request was made to the users endpoint.
   */
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log('type of id,', getUsersParamDto instanceof GetUsersParamDto);
    console.log('query,', limit);

    return 'You send a get request to users endpoint';
  }

  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto,
 
  ) {
    // console.log('body', body)
    const { firstName, lastName, email, password } = createUserDto;
    console.log(firstName, lastName, email, password);

    return 'You sent a POST request to users endpiint.';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
      return patchUserDto;
  }
}
