import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsAdquirentValidForPaymentMethod } from './isAdquirentValidForPaymentMethod.validator';

export class ChangeAdquirentBody {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PIX', 'CREDIT_CARD', 'BANK_SLIP'], {
    message:
      'payment_method must be one of the following: PIX, CREDIT_CARD, BANK_SLIP',
  })
  payment_method: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP';

  @IsString()
  @IsNotEmpty()
  @IsAdquirentValidForPaymentMethod({
    message: 'Invalid adquirent based on payment_method',
  })
  adquirent: string;
}
