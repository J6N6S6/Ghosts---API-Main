import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
