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
    const { commentId, lessonId } = args.object as any;
    return (commentId && !lessonId) || (!commentId && lessonId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Either "commentId" or "lessonId" must be provided, but not both.';
  }
}

export class CreateCommentDto {
  @IsOptional()
  @IsInt()
  commentId?: number;

  @IsOptional()
  @IsInt()
  lessonId?: number;

  @IsString()
  content: string;

  @Validate(CommentOrLessonValidator)
  validRelation: boolean;
}
