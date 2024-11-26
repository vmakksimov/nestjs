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
} from '@nestjs/common';

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
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit') limit: any,
  ) {
    console.log('type of id,', typeof id);
    console.log('query,', limit);

    return 'You send a get request to users endpoint';
  }

  @Post()
  public createUsers(
    @Body() body: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    // console.log('body', body)
    const { firstName, lastName, email, password } = body;
    console.log(firstName, lastName, email, password);
    console.log('headers', headers);
    console.log('ip', ip);
    return 'You sent a POST request to users endpiint.';
  }
}
