import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-inteface';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(MetaOption)
    private readonly postMetaOptionsRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags = undefined;

    try {
      author = await this.usersService.findById(user.subject);
    } catch (error) {
      throw new BadRequestException(
        `User with id ${user.subject} does not exist`,
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
}
