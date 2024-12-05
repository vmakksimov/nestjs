import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async createTag(createtagDto: CreateTagDto){
    let tag = this.tagsRepository.create(createtagDto)
    return await this.tagsRepository.save(tag)
  }

  public async findMultipleTags(tags: number[]){
    let results = await this.tagsRepository.find({
      where: {
        id: In(tags)
      }
    })

    return results;

  }

  public async deleteTag(id:number){
    console.log('id of tag', id)
    await this.tagsRepository.delete(id);
    return {message: 'tag deleted', id}
  }

  public async softRemove(id: number){
    await this.tagsRepository.softDelete(id);
    return {message: 'tag soft deleted', id}
  }
}
