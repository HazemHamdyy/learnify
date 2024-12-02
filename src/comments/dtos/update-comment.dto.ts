import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: `The comment's content`,
    required: true,
    example: 'Example updated comment',
  })
  @IsString()
  content: string;
}
