import { Body, Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly postMetaOptionsRepository: Repository<MetaOption>,
   
    private readonly tagsService: TagsService,

  ) {}

  public async createPost(@Body() createPostDto: CreatePostDto) {
    // const { metaOptions, authorId, tags } = createPostDto;
    let author = await this.usersService.findById(createPostDto.authorId);
    let tags = await this.tagsService.findMultipleTags(createPostDto.tags)
    let post = this.postRepository.create({...createPostDto, author: author, tags: tags})
    if (createPostDto.metaOptions) {
      const metaOptionEntity = this.postMetaOptionsRepository.create(createPostDto.metaOptions);
      const savedMetaOption = await this.postMetaOptionsRepository.save(metaOptionEntity);
      post.metaOptions = savedMetaOption; // Link the saved MetaOption to the Post
  }
    return await this.postRepository.save(post)

  }
  public async findAll(userId: string) {
    // setting relations if Eager loading is not set in the entity
    let posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true
      }
    })
    return posts;
  }

  public async updatePost(patchPostDto: PatchPostDto){
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags)
    let post = await this.postRepository.findOneBy({
      id: patchPostDto.id
    })
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags 

    return await this.postRepository.save(post)
    
  }

  public async deletePost(id: number){
    console.log("id of deletePOst in service", id)
    let post = await this.postRepository.delete(id)
    // await this.postRepository.delete(id)
    // await this.postMetaOptionsRepository.delete(post.metaOptions.id)

    // let inversePost = await this.postMetaOptionsRepository.find({
    //   where: { id: post.metaOptions.id },
    //   relations: {
    //     post: true
    //   }
    // })
    return {deleted: true}
  }
}
