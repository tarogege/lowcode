import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ContentDto {
  @ApiProperty({ example: '内容画布' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'content', default: 'content' })
  @IsString()
  type: string;

  @ApiPropertyOptional()
  id?: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ example: '1' })
  userId?: ObjectId;

  @ApiProperty()
  thumbnail?: object;
}
