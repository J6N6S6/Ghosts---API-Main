import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateBuyerBody {
  @IsOptional()
  affiliate_id?: string;

  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone('pt-BR')
  phone: string;

  @IsOptional()
  document: string;

  @IsOptional()
  @IsEnum(['PIX', 'BANK_SLIP', 'CREDIT_CARD'])
  payment_method: 'PIX' | 'BANK_SLIP' | 'CREDIT_CARD';

  @IsOptional()
  utm_source?: string;

  @IsOptional()
  utm_medium?: string;

  @IsOptional()
  utm_campaign?: string;

  @IsOptional()
  utm_term?: string;

  @IsOptional()
  utm_content?: string;

  @IsOptional()
  visitor_id?: string;

  @IsOptional()
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    cep?: string;
  };
}
