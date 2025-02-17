import { ThreeDSInfo } from 'mercadopago/dist/clients/payment/commonTypes';
import { BasePaymentResponse } from './BasePaymentResponse.dto';

export interface CreditCardPaymentResponse extends BasePaymentResponse {
  data?: BasePaymentResponse['data'] & {
    authorization_code?: string;
    brand?: string;
    capture: boolean;
    use_tds: boolean;
    three_ds_info?: ThreeDSInfo;
  };
}
