import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCoursesDto {
  @ApiProperty({
    description: `The name or part of name to search`,
    required: false,
    example: 'nest',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: `The minimum price to search`,
    required: false,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: `The maximum price to search`,
    required: false,
    example: 150,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: `The id of thhe course's teacher to search`,
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teacherId?: number;

  @ApiProperty({
    description: `The id of thhe course's category to search`,
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiProperty({
    description: `The number pages to skip`,
    required: false,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip: number = 0;

  @ApiProperty({
    description: `The number courses to take`,
    required: false,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  take: number = 10;

  @ApiProperty({
    description: `The field to sort by`,
    required: false,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @ApiProperty({
    description: `asc or desc`,
    required: false,
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  order: 'asc' | 'desc' = 'desc';
}
