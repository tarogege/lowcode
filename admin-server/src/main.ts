import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import generateDocument from './doc';
import { ValidationPipe } from '@nestjs/common';
import { RemoveSensitiveInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';
import { AllExceptionFilter } from './shared/filters/all-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  generateDocument(app);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RemoveSensitiveInfoInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(3000);
}
bootstrap();
