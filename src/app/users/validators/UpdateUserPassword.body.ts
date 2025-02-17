import { IsString } from 'class-validator';

export class UpdateUserPasswordBody {
  @IsString()
  current_password: string;

  @IsString()
  new_password: string;
}
