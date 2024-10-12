import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Session,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户鉴权')
@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '注册' })
  @Post('/register')
  async register(@Body() request: RegisterDto) {
    return await this.authService.register(request);
  }

  @ApiOperation({ summary: '登录' })
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.login(loginDto);
    session.user = user;
    return user;
  }

  // @ApiOperation({summary: '登出'})

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: any) {
    return await this.authService.getUserInfo(req.user.id);
  }
}
