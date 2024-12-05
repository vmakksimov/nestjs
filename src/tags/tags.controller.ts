import { Body, Controller, Delete, Inject, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}


  @Post()
  public create(@Body() createTagDto: CreateTagDto){
    console.log('createTagDto', createTagDto)
    let newTag = this.tagsService.createTag(createTagDto)
    return newTag;
  }

  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number){
    return this.tagsService.deleteTag(id); 
  }

  // /tags/soft-delete
  @Delete('soft-delete')
  public async softDelete(@Query('id', ParseIntPipe) id: number){
    return this.tagsService.softRemove(id);
  }
}
