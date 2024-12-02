import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: `course id to enroll`,
    required: true,
    example: 1,
  })
  @IsInt()
  courseId: number;
}
