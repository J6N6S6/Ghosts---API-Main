import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsAdquirentValidForPaymentMethod } from './isAdquirentValidForPaymentMethod.validator';

export class UpdateUserTaxeBody {
  @IsString()
  @IsNotEmpty()
  taxe: string;
}
