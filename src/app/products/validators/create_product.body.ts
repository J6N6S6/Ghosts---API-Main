import { IsE164PhoneNumber } from '@/helpers/transform.helper';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(5)
  price: number;

  @IsNotEmpty()
  @IsUrl({
    //require_protocol: true,
    //protocols: ['https'],
  })
  product_website: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;

  @IsNotEmpty()
  @IsEnum(['ONE_TIME', 'SUBSCRIPTION'])
  payment_type: 'ONE_TIME' | 'SUBSCRIPTION';

  @IsNotEmpty()
  @IsEnum(['EBOOK', 'ONLINE_COURSE', 'LIVE_MENTORING', 'FILES'])
  product_type: 'EBOOK' | 'ONLINE_COURSE' | 'LIVE_MENTORING' | 'FILES';

  @IsNotEmpty()
  @IsEnum(['EXTERNAL', 'INTERNAL', 'CHECKOUT_ONLY'])
  members_area: 'EXTERNAL' | 'INTERNAL' | 'CHECKOUT_ONLY';

  @IsNotEmpty()
  @IsEmail()
  support_email: string;

  @IsNotEmpty()
  @IsString()
  producer_name: string;

  @IsOptional()
  @IsUrl({
    //require_protocol: true,
    //protocols: ['https'],
  })
  product_content_link: string;

  @IsNotEmpty()
  @IsE164PhoneNumber()
  support_phone: string;
}
