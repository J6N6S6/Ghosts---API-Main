import { IsArray, IsEnum } from 'class-validator';

export class UpdateProductPaymentMethodsBody {
  @IsArray()
  @IsEnum(['PIX', 'BANK_SLIP', 'CREDIT_CARD'], { each: true })
  payment_methods?: string[];
}
