import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: `The course's name`,
    required: true,
    example: 'Nest Js Backend Development',
  })
  @IsString()
  @Length(10, 50)
  name: string;

  @ApiProperty({
    description: `The course's description`,
    required: true,
    example:
      'This is description for nestjs course. in this course you will learn Typescript, Prisma, and more...',
  })
  @IsString()
  @Length(40, 1000)
  description: string;

  @ApiProperty({
    description: `The course's price but isn't required`,
    required: false,
    example: 99.99,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: `The duration of the course in minutes`,
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  durationInMinutes?: number;

  @ApiProperty({
    description: `The course's image url`,
    required: false,
    example:
      'https://drive.google.com/file/d/1npFkj_1sp5GinRJMPDsdZg1j3ja7phar/view?usp=drivesdk',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: `The category id`,
    required: true,
    example: 1,
  })
  @IsNumber()
  categoryId: number;
}
