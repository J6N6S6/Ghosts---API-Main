import { IsOptional, IsString } from 'class-validator';

export class UpdatePixelBody {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  purchase_event_pix: boolean;

  @IsOptional()
  purchase_event_bank_slip: boolean;
}
