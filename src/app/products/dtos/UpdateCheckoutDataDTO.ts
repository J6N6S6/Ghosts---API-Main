export interface updateCheckoutDataDTO {
  product_id: string;

  payment_method?: string[];
  allow_payment_with_two_cards?: boolean;
  repeat_email_in_checkout?: boolean;
  inputs_checkout?: {
    birthdate: boolean;
    phone: boolean;
    address: boolean;
  };
  upsell_url?: string | null;
  whatsapp_link?: string | null;
  notifications?: {
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
  countdown?: {
    enabled: boolean;
    time_minutes: number;
    text_active: string;
    text_expired: string;
    text_color: string;
    background_color: string;
  };
  purchase_button?: {
    text: string;
    bg_color: string;
    text_color: string;
  };
  back_redirect_url?: string;
  color_section?: string;
}
