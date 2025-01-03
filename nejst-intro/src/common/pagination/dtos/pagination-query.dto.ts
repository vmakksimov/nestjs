import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { number } from "joi";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit?: number = 10;
    

    @IsOptional()
    @IsPositive()
    page?: number = 1;
}