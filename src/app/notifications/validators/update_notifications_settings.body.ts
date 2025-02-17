import { IsOptional } from 'class-validator';

export class UpdateNotificationsSettingsBody {
  @IsOptional()
  MAIL_INDICATION_SALE?: boolean;

  @IsOptional()
  MAIL_NEW_INDICATION?: boolean;

  @IsOptional()
  MAIL_NEW_SALE_CONFIRM?: boolean;

  @IsOptional()
  MOBILE_APPROVED_SALES?: boolean;

  @IsOptional()
  MOBILE_GENERATED_PIX_AND_BANK_SLIP?: boolean;
}
