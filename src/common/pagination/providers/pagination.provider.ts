import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import {REQUEST} from '@nestjs/core';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ){

    }
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    let results = await repository.find({
        skip: (paginationQuery.page -1 ) * paginationQuery.limit,
        take: paginationQuery.limit
  
      })

      const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
      console.log("URL", baseURL)
      return results;
  }
}
