import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class NewSessionBody {
  @IsString()
  @IsNotEmpty()
  user_email: string;

  @IsNotEmpty()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  @IsString()
  available_balance: string;
}
