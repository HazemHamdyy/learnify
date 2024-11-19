import { IsEmail, IsInt, IsString } from 'class-validator';

export class SessionDataDto {
  @IsInt()
  userId: number;

  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  courseName: string;

  @IsInt()
  coursePrice: number;
}
