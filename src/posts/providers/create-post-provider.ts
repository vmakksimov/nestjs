import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-inteface';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly prisma: DatabasePrismaService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags = undefined;

    try {
      console.log('userrr', user);
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
    try {
      return this.prisma.post.create({
        data: {
          title: createPostDto.title,
          postType: createPostDto.postType,
          slug: createPostDto.slug,
          status: createPostDto.status,
          content: createPostDto.content,
          schema: createPostDto.schema
            ? JSON.parse(createPostDto.schema)
            : null, // Parse the JSON string
          featuredImageUrl: createPostDto.featuredImageUrl,
          publishOn: createPostDto.publishOn,
          author: {
            connect: { id: author.id },
          },
          tags: {
            create: tags.map((tag: any) => ({
              tag: {
                connect: { id: tag.id },
              },
            })),
          },
          metaOptions: createPostDto.metaOptions
            ? {
                create: {
                  metaValue: createPostDto.metaOptions.metaValue,
                },
              }
            : undefined,
        },
      });
    } catch (error) {
      console.log('error from tag', error);
      throw new BadRequestException(error.message);
    }
  }
}
