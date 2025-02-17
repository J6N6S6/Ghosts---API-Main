import { BasePaymentResponse } from './BasePaymentResponse.dto';

export interface BankSlipPaymentResponse extends BasePaymentResponse {
  data: BasePaymentResponse['data'] & {
    bank_slip_url: string;
    bank_slip_barcode: string;
  };
}
