import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthLoginBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  session_origin?: string;
}
