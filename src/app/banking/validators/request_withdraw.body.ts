import { IsNotEmpty, Min } from 'class-validator';

export class RequestWithdrawBody {
  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  account_id: string;
}
