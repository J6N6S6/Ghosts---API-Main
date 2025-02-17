import { NotEqual } from '@/helpers/transform.helper';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordBody {
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @NotEqual('old_password', 'A nova senha não pode ser igual a antiga!')
  new_password: string;
}
