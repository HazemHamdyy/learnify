import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom Validator for Either `lessonId` or `commentId`
@ValidatorConstraint({ name: 'CommentOrLesson', async: false })
class CommentOrLessonValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const { parentCommentId, lessonId } = args.object as any;
    return (parentCommentId && !lessonId) || (!parentCommentId && lessonId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Either (parentCommentId) or (lessonId) must be provided, but not both.';
  }
}

export class CreateCommentDto {
  @ApiProperty({
    description: 'The id of parent comment',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parentCommentId?: number;

  @ApiProperty({
    description: `The id of lesson's comment`,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  lessonId?: number;

  @ApiProperty({
    description: `The comment's content`,
    required: true,
    example: 'Example comment',
  })
  @IsString()
  content: string;

  @Validate(CommentOrLessonValidator)
  validRelation: boolean;
}
