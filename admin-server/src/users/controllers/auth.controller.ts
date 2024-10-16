import { LoggerService } from './../../shared/logger/logger.service';
import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Session,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户鉴权')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @ApiOperation({ summary: '注册' })
  @HttpCode(200)
  @Post('/register')
  async register(@Body() request: RegisterDto) {
    this.loggerService.info(null, '注册用户');
    // return { data: 'mmm' };
    return await this.authService.register(request);
  }

  @ApiOperation({ summary: '登录' })
  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    // @Session() session: Record<string, any>,
  ) {
    this.loggerService.info(null, '用户登录');
    const user = await this.authService.login(loginDto);
    // session.user = user;
    return user;
  }

  // @ApiOperation({summary: '登出'})

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: any) {
    this.loggerService.info(null, '获取已经登录的用户信息');
    return await this.authService.getUserInfo(req.user.id);
  }
}
