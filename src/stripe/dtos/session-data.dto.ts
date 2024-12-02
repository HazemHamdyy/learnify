import { IsEmail, IsInt, IsString, IsUrl } from 'class-validator';

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

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;
}
