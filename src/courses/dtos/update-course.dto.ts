import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { CourseStatusEnum } from '../enums/course-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    description: `Status of the course`,
    required: true,
    example: CourseStatusEnum.PUBLISHED,
  })
  @IsEnum(CourseStatusEnum, {
    message: 'It must be DRAFT OR UPDATING OR PUBLISHED',
  })
  @IsOptional()
  status: CourseStatusEnum;
}
