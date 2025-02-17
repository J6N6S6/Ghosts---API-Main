import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePixelBody {
  @IsNotEmpty()
  @IsEnum(['FACEBOOK', 'GOOGLE', 'TIKTOK', 'KWAI'])
  type: 'FACEBOOK' | 'GOOGLE' | 'TIKTOK' | 'KWAI';

  @IsOptional()
  token: string;

  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsNotEmpty()
  purchase_event_pix: boolean;

  @IsNotEmpty()
  purchase_event_bank_slip: boolean;
}
