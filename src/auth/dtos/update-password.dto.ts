import { IsStrongPassword } from 'class-validator';

export class UpadatePasswordDto {
  readonly oldPassword: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  readonly newPassword: string;
}
