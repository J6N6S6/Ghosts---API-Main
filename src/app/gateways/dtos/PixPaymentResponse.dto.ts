import { BasePaymentResponse } from './BasePaymentResponse.dto';

export interface PixPaymentResponse extends BasePaymentResponse {
  data?: BasePaymentResponse['data'] & {
    pix_key: string;
    expiration_date: string;
  };
}
