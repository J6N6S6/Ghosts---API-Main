import { IsBirthDate, IsE164PhoneNumber } from '@/helpers/transform.helper';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class PayerUtmDTO {
  @IsString()
  @IsOptional()
  @MaxLength(128)
  source?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  medium?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  campaign?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  term?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  content?: string;
}

class PayerAddressDTO {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  cep: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  state: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(6)
  number?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(48)
  complement?: string;
}

class PayerDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(14)
  document: string;

  @IsOptional()
  @IsString()
  @IsE164PhoneNumber()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsBirthDate()
  birth_date?: string;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PayerAddressDTO)
  address?: PayerAddressDTO;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PayerUtmDTO)
  utm?: PayerUtmDTO;
}

class CardDataDTO {
  @IsString()
  @IsOptional()
  card_number?: string;

  @IsString()
  @IsOptional()
  card_holder_name?: string;

  @IsString()
  @IsOptional()
  card_expiration_date?: string;

  @IsString()
  @IsOptional()
  card_cvv?: string;

  @IsString()
  @IsOptional()
  card_token?: string;

  @IsNumber()
  @IsNotEmpty()
  installment: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreatePaymentBody {
  @IsNotEmpty()
  @IsNumber()
  public product_value: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(12)
  public product_link: string;

  @IsOptional()
  public additional_products?: {
    product_id: string;
    product_value: number;
  }[];

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PayerDTO)
  public payer: PayerDTO;

  @IsNotEmpty()
  @IsEnum(['PIX', 'CREDIT_CARD', 'BANK_SLIP'])
  public payment_method: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP';

  @IsNotEmpty()
  public use_two_cards?: boolean;

  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CardDataDTO)
  public card_data: CardDataDTO[];

  @IsOptional()
  public affiliate_id?: string;
}
