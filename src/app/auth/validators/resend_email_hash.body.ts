import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailHashBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
