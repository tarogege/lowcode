import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { DatabaseProviders } from './databse.providers';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  providers: [...DatabaseProviders],
  exports: [ConfigModule, ...DatabaseProviders],
})
export class SharedModule {}
