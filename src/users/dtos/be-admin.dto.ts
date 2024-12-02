import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class BeAdminDto {
  @ApiProperty({
    description: 'The user id to become admin',
    required: false,
    example: 2,
  })
  @IsInt()
  userId: number;
}
