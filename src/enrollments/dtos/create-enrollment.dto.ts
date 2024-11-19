import { IsInt, IsUrl } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  courseId: number;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}
