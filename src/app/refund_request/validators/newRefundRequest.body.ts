import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class NewRefundRequestBody {
  @IsString()
  @IsNotEmpty()
  buyer_name: string;

  @IsEmail()
  @IsNotEmpty()
  transaction_email: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  buyer_document: string;

  @IsNotEmpty()
  @IsE164PhoneNumber()
  buyer_phone: string;

  @IsNotEmpty()
  @IsString()
  pix_key: string;

  @IsString()
  @IsNotEmpty()
  @Length(12)
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
