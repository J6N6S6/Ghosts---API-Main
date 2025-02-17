import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateGeneralSettingsBody {
  @IsOptional()
  @IsBoolean()
  allow_affiliate?: boolean;

  @IsOptional()
  @IsNumber()
  affiliate_commission?: number;

  @IsOptional()
  @IsNumber()
  affiliate_commission_orderbump?: number;

  @IsOptional()
  @IsBoolean()
  affiliate_automatically_approve?: boolean;

  @IsOptional()
  @IsEnum(['LAST_CLICK', 'FIRST_CLICK'])
  affiliate_assignment?: 'LAST_CLICK' | 'FIRST_CLICK';

  @IsOptional()
  @IsBoolean()
  allow_marketplace?: boolean;

  @IsOptional()
  @IsString()
  marketplace_checkout_link?: string;

  @IsOptional()
  @IsString()
  marketplace_description?: string;

  @IsOptional()
  @IsEmail()
  marketplace_support_email?: string;
}
