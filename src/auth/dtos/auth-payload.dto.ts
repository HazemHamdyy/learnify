import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'The email of the user',
    required: true,
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password',
    required: true,
    example: 'Example@123',
  })
  @IsString()
  password: string;
}
