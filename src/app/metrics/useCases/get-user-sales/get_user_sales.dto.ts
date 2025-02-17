export interface GetUserSalesDto {
  start_date: Date;
  end_date: Date;
  product_id?: string;
  userId: string;
}

export interface GetUserSalesResponse {
  hasError: boolean;
  data: {
    credit_card: {
      total_transactions_approved: number;
      total_transactions_canceled: number;
      total_percent_conversion: string;
    };
    bank_slip: {
      total_transactions_approved: number;
      total_transactions_generated: number;
      total_percent_conversion: string;
    };
    pix: {
      total_transactions_approved: number;
      total_transactions_generated: number;
      total_percent_conversion: string;
    };
  };
}
