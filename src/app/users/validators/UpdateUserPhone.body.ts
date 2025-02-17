import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { IsEnum } from 'class-validator';

export class UpdateUserPhoneBody {
  @IsEnum(['sms', 'whatsapp'])
  public method: 'sms' | 'whatsapp';

  @IsE164PhoneNumber()
  public phone: string;
}
