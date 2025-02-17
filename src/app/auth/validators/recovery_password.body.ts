import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoveryPasswordBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
