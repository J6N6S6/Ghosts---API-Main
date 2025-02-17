import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateTaxeBody {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  pix_payment_fee: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  pix_fixed_amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  bank_slip_payment_fee: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  bank_slip_fixed_amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  withdrawal_fee: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  withdrawal_fixed_amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  secure_reserve_fee: number;

  @IsString()
  @IsNotEmpty()
  secure_reserve_time: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '7d_card_payment_fee': number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '7d_card_fixed_amount': number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '15d_card_payment_fee': number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '15d_card_fixed_amount': number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '30d_card_payment_fee': number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  '30d_card_fixed_amount': number;
}
