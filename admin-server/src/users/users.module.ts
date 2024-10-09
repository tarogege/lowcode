import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './users.providers';

@Module({
  imports: [SharedModule],
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
})
export class UsersModule {}
