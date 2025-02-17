import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class UpdateProductCheckoutBody {
  @IsOptional()
  @IsArray()
  payment_method?: string[];

  @IsOptional()
  @IsBoolean()
  allow_payment_with_two_cards: boolean;

  @IsOptional()
  @IsBoolean()
  repeat_email_in_checkout: boolean;

  @IsOptional()
  inputs_checkout: {
    birthdate: boolean;
    phone: boolean;
    address: boolean;
  };

  @ValidateIf((obj, value) => value !== null)
  @IsUrl({
    require_protocol: true,
    protocols: ['https'],
  })
  upsell_url: string | null;

  @ValidateIf((obj, value) => value !== null)
  @IsUrl({
    require_protocol: true,
    protocols: ['https'],
    require_host: true,
    host_whitelist: ['wa.me'],
  })
  whatsapp_link: string | null;

  @IsOptional()
  @IsObject()
  notifications: {
    enabled: boolean;
    male_notification: {
      enabled: boolean;
    };
    female_notification: {
      enabled: boolean;
    };
    today_notification: {
      enabled: boolean;
      min: number;
      max: number;
    };
    now_notification: {
      enabled: boolean;
      min: number;
      max: number;
    };
  };

  @IsOptional()
  @IsObject()
  countdown: {
    enabled: boolean;
    time_minutes: number;
    text_active: string;
    text_expired: string;
    text_color: string;
    background_color: string;
  };

  @IsOptional()
  @IsObject()
  purchase_button: {
    text: string;
    text_color: string;
    bg_color: string;
  };

  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['https'],
  })
  back_redirect_url: string;

  @IsOptional()
  color_section?: string;
}
