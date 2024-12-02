import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    description: `The section name`,
    required: true,
    example: 'fundamentals',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: `The Section number to order them`,
    required: true,
    example: 1,
  })
  @IsInt()
  sectionNumber: number;

  @ApiProperty({
    description: `THe course id that have the section`,
    required: true,
    example: 1,
  })
  @IsNumber()
  courseId: number;
}
