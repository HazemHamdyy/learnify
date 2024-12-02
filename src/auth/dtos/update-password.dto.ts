import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpadatePasswordDto {
  @ApiProperty({
    description: 'The old password',
    required: true,
    example: 'Example@123',
  })
  @IsString()
  readonly oldPassword: string;

  @ApiProperty({
    description: 'The strong updated password',
    required: true,
    example: 'Example@123',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  readonly newPassword: string;
}
