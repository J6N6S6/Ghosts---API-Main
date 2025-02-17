export interface CreatePixelDTO {
  title?: string;
  product_id: string;
  user_id: string;
  content: string;
  domain?: string;
  type: 'FACEBOOK' | 'GOOGLE' | 'TIKTOK' | 'KWAI';
  token?: string;
  purchase_event_pix: boolean;
  purchase_event_bank_slip: boolean;
}
