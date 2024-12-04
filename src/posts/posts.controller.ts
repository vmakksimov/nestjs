import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
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
  }

  @Delete('/:postId')
  public deletePost(@Param('postId', ParseIntPipe) id: number){
    this.postsService.deletePost(id)
    return {status: 200, message: 'deleted'}

  }
}
