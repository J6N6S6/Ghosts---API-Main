import { IsNotEmpty } from 'class-validator';

export class RefreshTokenBody {
  @IsNotEmpty()
  refresh_token: string;
}
