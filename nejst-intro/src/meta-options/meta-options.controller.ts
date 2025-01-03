import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { create } from 'domain';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
    constructor(private readonly metaOptionsService: MetaOptionsService){}

    @Post()
    public createMetaOptions(@Body() metaOptionsDto: CreatePostMetaOptionsDto) {
        return this.metaOptionsService.createMetaOptions(metaOptionsDto);
    }
}
