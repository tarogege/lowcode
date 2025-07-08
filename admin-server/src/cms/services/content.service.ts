import { LoggerService } from './../../shared/logger/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/pagination-params.dto';
import { MongoRepository } from 'typeorm';
import { Content } from '../entities/content.mongo.entity';
import { ContentDto } from '../dtos/content.dto';
import * as puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as COS from 'cos-nodejs-sdk-v5';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


// TODO: need to store it in configService
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private readonly contentRepo: MongoRepository<Content>,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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

  async findOne(id: number) {
    const content = await this.contentRepo.findOneBy({
      // @ts-ignore
      id: Number.parseInt(id),
      isDelete: false,
    });
    return content;
  }

  async saveOne(contentDto: Partial<ContentDto>) {
    const { id } = contentDto;
    const has = await this.contentRepo.findOneBy({ id });
    const isCreate = !id || !has
    if (isCreate) {
      // 创建新画布
      const count = await this.contentRepo.count();
      contentDto.id = count + 1;
      contentDto['isDelete'] = false;
      await this.contentRepo.save(contentDto);
    } else {
      // 更新画布
      await this.contentRepo.updateOne({ id }, { $set: contentDto });
    }

    if(!isCreate) {
      try{
        // update的时候，需要给nextjs发送请求，更新ssg生产的html页面
        await firstValueFrom( this.httpService.get(`${process.env.BUILDER_HOST}/api/revalidate?id=${id}`))
        this.loggerService.info(null, 'Revalidate response:');
      } catch(err) {
        console.log(err, 'err')
        this.loggerService.error(null, 'Revalidate error:');
      }
    }
    const thumbanail = await this.takeScreenshotsAndUpload(contentDto.id);
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
        isDelete: false
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, count };
  }

  async takeScreenshotsAndUpload(id: number) {
    const url = `${process.env.BUILDER_HOST}/${id}`;
    const tmpDir = '/tmp/';
    const thumbnailFileName = `thumb_header_${id}.png`;
    const thumbnailFullFileName = `thumb_full_${id}.png`;
    const localHeaderPath = path.join(tmpDir, thumbnailFileName);
    const localFullPath = path.join(tmpDir, thumbnailFullFileName);

    await this._runPuppteer(url, {
      thumbnailFileName: localHeaderPath,
      thumbnailFullFileName: localFullPath,
    });

    // 上传到 COS
    const cosHeaderPath = `template/${thumbnailFileName}`;
    const cosFullPath = `template/${thumbnailFullFileName}`;
    const Bucket = process.env.COS_BUCKET; // 例如 'your-bucket-123456'
    const Region = process.env.COS_REGION; // 例如 'ap-shanghai'

    // 上传头图
    const headerPromise = new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket,
          Region,
          Key: cosHeaderPath,
          Body: fs.createReadStream(localHeaderPath),
          ContentType: 'image/png',
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });

    // 上传全图
    const fullPromise = new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket,
          Region,
          Key: cosFullPath,
          Body: fs.createReadStream(localFullPath),
          ContentType: 'image/png',
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });

    await headerPromise
    await fullPromise

    // 删除本地临时文件
    fs.unlinkSync(localHeaderPath);
    fs.unlinkSync(localFullPath);

    const cosHost = this.configService.get<string>('OSS_HOST'); // 你的 CDN 域名或 COS 访问域名
    return {
      header: `${cosHost}/${cosHeaderPath}`,
      full: `${cosHost}/${cosFullPath}`,
    };
  }

  private async _runPuppteer(
    url,
    { thumbnailFileName, thumbnailFullFileName },
  ) {
    let options: any = {
      args: [
        '--no-sandbox',
        '--lang=zh-CN',
        '--disable-features=site-per-process',
      ],
      headless: true,
      pipe: true,
    }
    if(process.env.NODE_ENV === 'production') {
      options.executablePath = '/usr/bin/google-chrome-stable'
    }
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({ width: 500, height: 700 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    // 用于nextjs页面revalidate之后确保能看到最新的内容
    await page.reload();

    // 截图
    await page.screenshot({ path: thumbnailFileName });
    await page.screenshot({ path: thumbnailFullFileName, fullPage: true });

    // FIXME:
    await page.close();
    await browser.close();
  }
}
