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

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsInt()
  sectionId: number;

  @IsEnum(ContentTypeEnum, {
    message: "Content type must be 'VIDEO', 'AUDIO' OR 'TEXT'",
  })
  contentType: ContentTypeEnum;

  @IsNumber()
  durationInMinutes: number;

  @IsUrl({}, { message: 'The contentFileLink must be a valid URL.' })
  contentFileLink: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}
