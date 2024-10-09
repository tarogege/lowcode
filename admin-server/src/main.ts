import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import generateDocument from './doc';
import { ValidationPipe } from '@nestjs/common';
import { RemoveSensitiveInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  generateDocument(app);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RemoveSensitiveInfoInterceptor());
  await app.listen(3000);
}
bootstrap();
