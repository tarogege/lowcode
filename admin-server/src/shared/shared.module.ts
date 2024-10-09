import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { DatabaseProviders } from './databse.providers';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), LoggerModule],
  providers: [...DatabaseProviders],
  exports: [ConfigModule, ...DatabaseProviders, LoggerModule],
})
export class SharedModule {}
