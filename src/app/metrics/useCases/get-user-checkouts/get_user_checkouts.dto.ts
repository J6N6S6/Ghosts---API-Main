export interface GetUserCheckoutsDto {
  start_date: Date;
  end_date: Date;
  product_id?: string;
  userId: string;
}

export interface GetUserCheckoutsResponse {
  hasError: boolean;
  data: {
    checkouts_open: number;
    checkouts_canceled: number;
    checkouts_approved: number;
  };
}
