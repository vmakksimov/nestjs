import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostMetaOptionsDto } from 'src/meta-options/dtos/create-post-meta-options.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly postMetaOptionsRepository: Repository<MetaOption>

  ) {}

  public async createPost(@Body() createPostDto: CreatePostDto) {
    const { metaOptions, authorId, ...postData } = createPostDto;
    let author = await this.usersService.findById(createPostDto.authorId);
    console.log('here before postrepositoriy save', createPostDto)

    let post = this.postRepository.create({...createPostDto, author: author})
    console.log("postt", post)
    if (metaOptions) {
      const metaOptionEntity = this.postMetaOptionsRepository.create(metaOptions);
      const savedMetaOption = await this.postMetaOptionsRepository.save(metaOptionEntity);
      post.metaOptions = savedMetaOption; // Link the saved MetaOption to the Post
  }
    return await this.postRepository.save(post)

  }
  public async findAll(userId: string) {
    // setting relations if Eager loading is not set in the entity
    let posts = await this.postRepository.find({
      relations: {
        metaOptions: true
      }
    })
    return posts;
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
