import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 20,
    type: Number,
    description: 'pagesize default 20',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value), { toClassOnly: true })
  pageSize = 20;

  @ApiPropertyOptional({
    example: 1,
    type: Number,
    description: 'pagesize default 100',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value), { toClassOnly: true })
  page = 1;
}
