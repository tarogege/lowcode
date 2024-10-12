import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';
import { MongoRepository } from 'typeorm';
import { Content } from '../entities/content.mongo.entity';
import { ContentDto } from '../dtos/content.dto';

@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private readonly contentRepo: MongoRepository<Content>,
  ) {}

  async getCanvasesList(userId: string, pageDto: PaginationDto) {
    // 查找user下面所有的canvas，并分页
    const { page, pageSize } = pageDto;
    const [data, count] = await this.contentRepo.findAndCount({
      where: {
        userId,
        isDelete: false,
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });

    return { data, count };
  }

  async findOne(id: string) {
    return await this.contentRepo.findOneBy({
      _id: Number.parseInt(id),
      isDelete: false,
    });
  }

  async saveOne(contentDto: Partial<ContentDto>) {
    const { id } = contentDto;
    const has = await this.contentRepo.findOneBy({ id });
    if (!id || !has) {
      // 创建新画布
      const count = await this.contentRepo.count();
      contentDto.id = count + 1;
      contentDto['isDelete'] = false;
      await this.contentRepo.save(contentDto);
    } else {
      // 更新画布
      await this.contentRepo.updateOne({ id }, { $set: contentDto });
    }
    return contentDto;
  }

  async remove(id: string) {
    return await this.contentRepo.updateOne(
      { id: parseInt(id) },
      { $set: { isDelete: true } },
    );
  }

  async findAllTemplate(pageDto: PaginationDto) {
    const { page, pageSize } = pageDto;
    const [data, count] = await this.contentRepo.findAndCount({
      where: {
        type: 'template',
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, count };
  }
}
