import { IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsNumber()
  sectionNumber: number;

  @IsNumber()
  courseId: number;
}
