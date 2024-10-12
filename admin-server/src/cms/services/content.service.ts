import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';
import { MongoRepository } from 'typeorm';
import { Content } from '../entities/content.mongo.entity';
import { ContentDto } from '../dtos/content.dto';
import puppeteer from 'puppeteer';
import path from 'path';

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

    const thumbanail = await this.takeScreenshots(id);
    contentDto.thumbnail = thumbanail;
    await this.contentRepo.updateOne({ id }, { $set: contentDto });
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

  async takeScreenshots(id: number) {
    const url = `http://builder.codebus.tech/?id=${id}`;
    const host = 'http://template.codebus.tech/';
    const prefix = `static/upload/`;
    const imgPath = path.join(__dirname, '../../../..', prefix);
    const thumbnailFileName = `thumb_header_${id}.png`;
    const thumbnailFullFileName = `thumb_full_${id}.png`;
    await this._runPuppteer(url, {
      thumbnailFileName: imgPath + thumbnailFileName,
      thumbnailFullFileName: imgPath + thumbnailFullFileName,
    });

    return {
      header: host + prefix + thumbnailFileName,
      full: host + prefix + thumbnailFullFileName,
    };
  }

  private async _runPuppteer(
    url,
    { thumbnailFileName, thumbnailFullFileName },
  ) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--lang=zh-CN'],
      headless: true,
    });
    const page = await browser.newPage();
    page.setViewport({ width: 750, height: 800 });
    page.goto(url, { waitUntil: 'networkidle0' });

    // 截图
    await page.screenshot({ path: thumbnailFileName });
    await page.screenshot({ path: thumbnailFullFileName });

    await browser.close();
  }
}
