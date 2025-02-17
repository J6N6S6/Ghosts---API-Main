export interface GetUserRevenueDto {
  start_date: Date;
  end_date: Date;
  product_id?: string;
  userId: string;
}

export interface GetUserRevenueResponse {
  hasError: boolean;
  data: {
    total_revenue: number;
    total_refunded: number;
    total_percent_refunded: string;
    total_transactions_approved: number;
    total_transactions_refunded: number;
  };
}
