import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import {REQUEST} from '@nestjs/core';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaginationProvider {
    constructor(
        private readonly prisma: DatabasePrismaService,
        @Inject(REQUEST)
        private readonly request: Request
    ){

    }
  public async paginateQuery<T>(
    paginationQuery: PaginationQueryDto,
    model: Prisma.ModelName
  ): Promise<Paginated<T>> {
    const prismaModel = this.prisma[model];
    if (!prismaModel) {
      throw new Error(`Model ${prismaModel} not found in PrismaService`);
    }
    const results = await prismaModel.findMany({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

      const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
      const newUrl = new URL(this.request.url, baseURL);
      console.log("URL", baseURL)

      const totalItems = await prismaModel.count();
      const totalPages = Math.ceil(totalItems/paginationQuery.limit);
      const nextpage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
      const prevpage = paginationQuery.page === 1 ? paginationQuery.page : paginationQuery.page - 1;
      const finalResponse: Paginated<T> = {
        data: results,
        meta: {
          itemsPerPage: paginationQuery.limit,
          totalItems: totalItems,
          currentPage: paginationQuery.page,
          totalPages: totalPages,
        },
        links: {
          first: newUrl.origin + newUrl.pathname + `?limit=${paginationQuery.limit}&page=1`,
          last: newUrl.origin + newUrl.pathname + `?limit=${paginationQuery.limit}&page=${totalPages}`,
          current: newUrl.origin + newUrl.pathname + `?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
          next: newUrl.origin + newUrl.pathname + `?limit=${paginationQuery.limit}&page=${nextpage}`,
          prev: newUrl.origin + newUrl.pathname + `?limit=${paginationQuery.limit}&page=${prevpage}`
        }
      }

      return finalResponse;
  }
}
