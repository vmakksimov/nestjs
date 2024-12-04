import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
  IsEnum,
  IsJSON,
  IsUrl,
  IsISO8601,
  IsArray,
  ValidateNested,
  MaxLength,
  IsInt,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: "This is the title for the blog post"
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(96)
  title: string;


  @ApiProperty({
    enum: postType,
    description: "Possible values, 'post', 'page', 'story', 'series'"
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "This is the slug for the blog post"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;


  @ApiProperty({
    enum: postStatus,
    description: "Possible values, 'draft', 'scheduled', 'review', 'published'"
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: "This is the content for the blog post",
    example: "This is the content for the blog post"
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: "This is the schema for the blog post",
    example: '{\r\n "@context": "https://schema.org", \r\n "@type": "Person", \r\n "name": "John Doe"\r\n}'
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
      description: "This is the featured image for the blog post",
      example: "https://example.com/image.png"
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: "This is the publish date for the blog post",
    example: "2022-01-01T00:00:00.000Z"
  })
  @IsOptional()
  @IsISO8601()
  publishOn?: Date;

  @ApiPropertyOptional({
    type: 'array',
    description: 'This is the tags for the blog post',
    example: ['tag1', 'tag2', 'tag3']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
      type: 'object',
      required: false,
      items: {
        type: 'object',
        properties: {
          metaValue: { type: 'json',
            description: 'This metaValue is JSON string',
            example: '{"sidebarEnabled":true,"sidebarPosition":"left"}'
           },
          
        }
      }
  })
  @IsOptional()
  @ValidateNested({each: true})
  @Type(()=> CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;


  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
