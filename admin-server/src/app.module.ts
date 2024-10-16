import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './shared/filters/all-exceptions-filter';
import { CmsModule } from './cms/cms.module';

@Module({
  imports: [UsersModule, CmsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule {}
