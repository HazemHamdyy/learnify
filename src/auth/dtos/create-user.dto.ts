import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Length,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    required: true,
    example: 'John Doe',
  })
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    example: 'test@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The strong password',
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
  readonly password: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    required: false,
    example: '2024-12-01T14:44:30.618Z',
  })
  @IsString()
  @IsOptional()
  readonly dateOfBirth: string;

  @ApiProperty({
    description: 'The bio mostly used for teachers',
    required: false,
    example: `I'm a good teacher`,
  })
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty({
    description: 'The profile image',
    required: false,
    example:
      'https://drive.google.com/file/d/1npFkj_1sp5GinRJMPDsdZg1j3ja7phar/view?usp=drivesdk',
  })
  @IsOptional()
  @IsUrl()
  imageUrl: string;
}
