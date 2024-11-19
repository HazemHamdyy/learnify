import { IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatusEnum } from '../enums/enrollment-status.enum';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsEnum(EnrollmentStatusEnum, {
    message:
      'status must be one of those values: PENDING, ACTTIVE, COMPLETED, CANCELLED, EXPIRED',
  })
  status?: EnrollmentStatusEnum;
}
