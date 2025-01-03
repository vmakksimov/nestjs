import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
    constructor(@InjectRepository(MetaOption)
     private readonly metaOptionRepository: Repository<MetaOption>) {

    }

    public async createMetaOptions(createMetaOptionsDto: CreatePostMetaOptionsDto){
        let metaOption = this.metaOptionRepository.create(createMetaOptionsDto)
        return await this.metaOptionRepository.save(metaOption)
    }
}
