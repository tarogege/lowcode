import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import generateDocument from './doc';
import { ValidationPipe } from '@nestjs/common';
import { RemoveSensitiveInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';
import { AllExceptionFilter } from './shared/filters/all-exceptions-filter';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  generateDocument(app);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 自动转换类型（关键！）
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式转换
        // excludeExtraneousValues: true, // 过滤DTO未声明的属性
      },
  }));
  app.useGlobalInterceptors(new RemoveSensitiveInfoInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(3000);
}
bootstrap();
