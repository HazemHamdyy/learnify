import {
  IsEmail,
  IsInt,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  readonly password: string;

  @IsInt()
  readonly age: number;
}
