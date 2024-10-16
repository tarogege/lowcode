import { LoggerService } from './../../shared/logger/logger.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';
import { ContentService } from '../services/content.service';
import { ContentDto } from '../dtos/content.dto';

@ApiTags('画布管理')
@Controller('/api/web/content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly loggerService: LoggerService,
  ) {}

  @ApiOperation({ summary: '画布列表' })
  @ApiBearerAuth()
  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() pageDto: PaginationDto, @Req() req: any) {
    this.loggerService.info(null, '获取画布列表');
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
  @Get('/get')
  async findOne(@Query() query: Partial<ContentDto>) {
    this.loggerService.info(null, '获取单个画布信息');
    const { id } = query;
    if (!id) {
      throw new BadRequestException('不存在该画布');
    }
    return await this.contentService.findOne(id);
  }

  @ApiOperation({ summary: '创建/更新画布' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/save')
  async saveOne(@Body() contentDto: ContentDto, @Req() req: any) {
    this.loggerService.info(null, 'save canvas');
    contentDto.userId = req.user.id;
    return await this.contentService.saveOne(contentDto);
  }

  @ApiOperation({ summary: '删除' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('/delete')
  async remove(@Body() dto) {
    await this.contentService.remove(dto.id);
  }
}
