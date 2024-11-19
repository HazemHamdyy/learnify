import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @Length(10, 50)
  name: string;

  @IsString()
  @Length(40, 1000)
  description: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  durationInMinutes?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;
}
