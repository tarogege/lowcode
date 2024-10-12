import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './users.providers';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, ...UserProviders, AuthService],
})
export class UsersModule {}
