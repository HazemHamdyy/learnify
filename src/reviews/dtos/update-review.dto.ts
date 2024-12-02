import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
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
