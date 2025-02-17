import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { IsString, Length } from 'class-validator';

export class VerifyUserPhoneBody {
  @IsString()
  @Length(6, 6)
  public code: string;

  @IsE164PhoneNumber()
  public phone: string;
}
