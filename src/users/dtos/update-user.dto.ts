import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dtos/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LimitedUserTypeEnum } from '../enums/limited-user-type.enum';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {
  @ApiProperty({
    description: 'The role of the user',
    required: false,
    example: `TEACHER`,
  })
  @IsOptional()
  @IsEnum(LimitedUserTypeEnum, {
    message: "Update user type to USER OR TEACHER (can't be ADMIN)",
  })
  @IsString()
  userType: LimitedUserTypeEnum;
}
