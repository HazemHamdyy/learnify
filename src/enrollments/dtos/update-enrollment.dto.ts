import { IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatusEnum } from '../enums/enrollment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnrollmentDto {
  @ApiProperty({
    description: `status of the enrollment NOTE: if the status was PENDING so you can't change the status (only changed from webhook)`,
    required: false,
    example: 'COMPLETED',
  })
  @IsOptional()
  @IsEnum(EnrollmentStatusEnum, {
    message:
      'status must be one of those values: PENDING, ACTTIVE, COMPLETED, CANCELLED, EXPIRED',
  })
  status?: EnrollmentStatusEnum;
}
