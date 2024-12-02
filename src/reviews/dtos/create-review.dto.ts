import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: `Course id to review it`,
    required: true,
    example: 1,
  })
  @IsInt()
  courseId: number;

  @ApiProperty({
    description: `review content`,
    required: true,
    example: 'This is a very good course',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: `rate the course`,
    required: true,
    example: 8,
  })
  @IsNumber()
  rating: number;
}
