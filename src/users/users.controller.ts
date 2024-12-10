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
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-params.dto';
import { get } from 'http';
import { isInstance } from 'class-validator';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';



@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('/:id?')
  @ApiOperation({
    summary: "Fetches a list of registered users for the docs"
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched succesfully based on the query'
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: "The number of entries returned from query",
    example: 10
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: "The position of the page we want to return",
    example: 1
  })

  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log('type of id,', getUsersParamDto instanceof GetUsersParamDto);
    console.log('query,', limit);

    const allusers = this.userService.findAll(
      getUsersParamDto,
      limit,
      page,
    )

    return allusers;
  }

  @Post()
  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - DTO containing required information for new user.
   * @returns {String} - A message indicating the user was created.
   * @throws {Error} - If the user could not be created.
   */
  public createUsers(@Body() createUserDto: CreateUserDto) {
    // console.log('body', body)
    const { firstName, lastName, email, password } = createUserDto;
    console.log(firstName, lastName, email, password);
    const newUser = this.userService.createUser(createUserDto);

    return newUser;
  }

  @Post('create-many')
  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - DTO containing required information for new user.
   * @returns {String} - A message indicating the user was created.
   * @throws {Error} - If the user could not be created.
   */
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    const newUsers = this.userService.createMany(createManyUsersDto);
    return newUsers;
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
