import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '13120878531' })
  @Matches(/^1\d{10}$/g, { message: '请输入手机号' })
  phoneNumber: string;

  @ApiProperty({ example: '毛毛' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @Length(6, 10)
  password: string;

  @ApiProperty({ example: '671309751@qq.com' })
  @IsEmail()
  email: string;
}
