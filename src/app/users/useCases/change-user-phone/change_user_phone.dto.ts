export interface ChangeUserPhoneDTO {
  user_id: string;
  phone: string;
  method: 'sms' | 'whatsapp';
  ip_address: string;
}
