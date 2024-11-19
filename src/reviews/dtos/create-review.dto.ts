import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  courseId: number;

  @IsString()
  content: string;

  @IsNumber()
  rating: number;
}
