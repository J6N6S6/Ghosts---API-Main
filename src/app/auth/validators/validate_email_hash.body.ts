import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ValidateEmailHashBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(64, 128)
  hash: string;
}
