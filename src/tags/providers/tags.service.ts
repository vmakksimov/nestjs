import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: DatabasePrismaService,
  ) {}

  public async createTag(createtagDto: CreateTagDto){
    return await this.prisma.tag.create({data: createtagDto});
  }

  public async findMultipleTags(tags: number[]){
    console.log("tagsss", await this.prisma.tag.findMany({
      where: {
        id: {in: tags}
      }
    }))
    return await this.prisma.tag.findMany({
      where: {
        id: {in: tags}
      }
    })

  }

  public async deleteTag(id:number){
    console.log('id of tag', id)
    await this.prisma.tag.delete({where: {id}});
    return {message: 'tag deleted', id}
  }

  // public async softRemove(id: number){
  //   await this.tagsRepository.softDelete(id);
  //   return {message: 'tag soft deleted', id}
  // }
}
