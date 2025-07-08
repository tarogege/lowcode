import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { DatabaseProviders } from './databse.providers';
import { LoggerModule } from './logger/logger.module';
import { SystemController } from './controllers/system.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), LoggerModule, HttpModule],
  controllers: [SystemController],
  providers: [...DatabaseProviders],
  exports: [ConfigModule, ...DatabaseProviders, LoggerModule, HttpModule],
})
export class SharedModule {}
