import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'maomao' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123455' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
