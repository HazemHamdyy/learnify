import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The category name',
    required: true,
    example: 'Web Development',
  })
  @IsString()
  name: string;
}
