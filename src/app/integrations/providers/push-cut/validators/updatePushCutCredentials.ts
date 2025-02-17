import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePushCutCredentialsBody {
  @IsString()
  @IsNotEmpty()
  pending_transaction_webhook_url: string;

  @IsString()
  @IsNotEmpty()
  authorized_transaction_webhook_url: string;
}
