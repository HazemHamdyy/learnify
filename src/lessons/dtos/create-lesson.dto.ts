import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ContentTypeEnum } from '../enums/content-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: `The lesson name`,
    required: true,
    example: 'introduction',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: `The Section number to order them`,
    required: true,
    example: 1,
  })
  @IsInt()
  lessonNumber: number;

  @ApiProperty({
    description: `The section id that had this lesson`,
    required: true,
    example: 1,
  })
  @IsInt()
  sectionId: number;

  @ApiProperty({
    description: `The content type like VIDEO OR AUDIO`,
    required: true,
    example: 'VIDEO',
  })
  @IsEnum(ContentTypeEnum, {
    message: "Content type must be 'VIDEO', 'AUDIO' OR 'TEXT'",
  })
  contentType: ContentTypeEnum;

  @ApiProperty({
    description: `The duration of the lesson in minutes`,
    required: true,
    example: 5,
  })
  @IsNumber()
  durationInMinutes: number;

  @ApiProperty({
    description: `link for the video or audio`,
    required: true,
    example:
      'https://drive.google.com/file/d/1eye_v0fdYxUij0Fh3OoBr3cQ-DtVU7lb/view?usp=drivesdk',
  })
  @IsUrl({}, { message: 'The contentFileLink must be a valid URL.' })
  contentFileLink: string;

  @ApiProperty({
    description: `is the lesson free "Public"? it's by default "False"`,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}
