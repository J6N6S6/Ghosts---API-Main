export interface BasePaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: BaseResponseSuccess;
}

type BaseResponseSuccess = {
  total_transaction_value: number;
  total_paid?: number;
  net_value?: number;

  payment_id: string;
  status: string;
  status_detail: string;
};
