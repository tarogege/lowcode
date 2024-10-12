import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';
import { ContentService } from '../services/content.service';
import { ContentDto } from '../dtos/content.dto';

@ApiTags('画布管理')
@Controller('/api/web/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: '画布列表' })
  @ApiBearerAuth()
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() pageDto: PaginationDto, @Req() req: any) {
    const { data, count } = await this.contentService.getCanvasesList(
      req.user.id,
      pageDto,
    );
    return {
      data,
      count,
      ...pageDto,
    };
  }

  @ApiOperation({ summary: '获取单个画布具体信息' })
  @Get()
  async findOne(@Query() query) {
    const { id } = query;
    return await this.contentService.findOne(id);
  }

  @ApiOperation({ summary: '创建/更新画布' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/save')
  async saveOne(@Body() contentDto: ContentDto, @Req() req: any) {
    contentDto.userId = req.user.id;
    return await this.contentService.saveOne(contentDto);
  }

  @ApiOperation({ summary: '删除' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/delete')
  async remove(@Body() dto) {
    await this.contentService.remove(dto.id);
  }
}
