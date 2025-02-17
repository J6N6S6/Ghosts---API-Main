import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateProductBody {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(10)
  price: number;

  @IsOptional()
  @IsUrl({
    //require_protocol: true,
    //protocols: ['https'],
  })
  product_website: string;

  @IsOptional()
  @IsEnum(['ONE_TIME', 'SUBSCRIPTION'])
  payment_type: 'ONE_TIME' | 'SUBSCRIPTION';

  @IsOptional()
  @IsEmail()
  support_email: string;

  @IsOptional()
  @IsE164PhoneNumber()
  support_phone?: string;

  @IsOptional()
  @IsString()
  producer_name: string;
}
