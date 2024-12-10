import {
  BadRequestException,
  Body,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostMetaOptionsDto } from 'src/meta-options/dtos/create-post-meta-options.dto';
import { Tag } from 'src/tags/tag.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch-post.dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly postMetaOptionsRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async createPost(@Body() createPostDto: CreatePostDto) {
    // const { metaOptions, authorId, tags } = createPostDto;\
    let author = undefined;
    let tags = undefined;

    try {
      author = await this.usersService.findById(createPostDto.authorId);
    } catch (error) {
      throw new BadRequestException(
        `User with id ${createPostDto.authorId} does not exist`,
      );
    }

    try {
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new BadRequestException(
        `Tag with id ${createPostDto.tags} does not exist`,
      );
    }

    let post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    if (createPostDto.metaOptions) {
      const metaOptionEntity = this.postMetaOptionsRepository.create(
        createPostDto.metaOptions,
      );
      const savedMetaOption =
        await this.postMetaOptionsRepository.save(metaOptionEntity);
      post.metaOptions = savedMetaOption; // Link the saved MetaOption to the Post
    }

    try {
      await this.postRepository.save(post);
      return;
    } catch (error) {
      throw new BadRequestException(
        `Error while saving post to the DB: ${error.message}`,
      );
    }
  }
  public async findAll(postQuery: GetPostsDto, userId: string) {
    // setting relations if Eager loading is not set in the entity
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
    return posts;
  }

  public async updatePost(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;

    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        `Tag with id ${patchPostDto.tags} does not exist`,
      );
    }

    if (!tags) {
      throw new BadRequestException(
        `Tag with id ${patchPostDto.tags} does not exist`,
      );
    }

    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new BadRequestException(
        `Post with id ${patchPostDto.tags} does not exist`,
      );
    }

    if (!post) {
      throw new BadRequestException(
        `Post with id ${patchPostDto.tags} does not exist`,
      );
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags;

    try {
      await this.postRepository.save(post);
      return;
    } catch (error) {
      throw new BadRequestException(
        `Error while saving post to the DB: ${error.message}`,
      );
    }
  }

  public async deletePost(id: number) {
    console.log('id of deletePOst in service', id);
    let post = await this.postRepository.delete(id);
    // await this.postRepository.delete(id)
    // await this.postMetaOptionsRepository.delete(post.metaOptions.id)

    // let inversePost = await this.postMetaOptionsRepository.find({
    //   where: { id: post.metaOptions.id },
    //   relations: {
    //     post: true
    //   }
    // })
    return { deleted: true };
  }
}
