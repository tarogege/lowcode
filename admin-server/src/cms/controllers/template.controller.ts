import { ContentService } from './../services/content.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';

@Controller('api/web/template')
export class TemplateController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: '获取所有模版类型画布' })
  @Get('list')
  async findAll(@Query() pageDto: PaginationDto) {
    return await this.contentService.findAllTemplate(pageDto);
  }
}
