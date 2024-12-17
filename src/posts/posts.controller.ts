import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe, Query, Req } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-inteface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string, @Query() postQuery: GetPostsDto) {
    const date = new Date();
    console.log('date', date.toString())
    console.log('postQuery', postQuery)
    return this.postsService.findAll(postQuery, userId);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    console.log('createPostDto', createPostDto)
    console.log("user in createPost", user)
    return this.postsService.createPost(createPostDto, user);
    // const {title, description} = createPostDto;
    // console.log('postDto title', title)
    // console.log('postDto desc', description)
  }


  @ApiOperation({ summary: 'Updates a new post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  
  @Patch('/:postId')
  public updatePost(@Body() patchPostsDto: PatchPostDto) {
    console.log('patchPostsDto', patchPostsDto);
    return this.postsService.updatePost(patchPostsDto)
  }

  @Delete('/:postId')
  public deletePost(@Param('postId', ParseIntPipe) id: number){
    this.postsService.deletePost(id)
    return {status: 200, message: 'deleted'}

  }
}
