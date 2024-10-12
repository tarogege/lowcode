import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'maomao' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456' })
  password: string;
}
