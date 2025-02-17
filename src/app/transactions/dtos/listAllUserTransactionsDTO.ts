export interface listAllUserTransactionsDTO {
  user_id: string;
  page: number;
  items_per_page: number;
  filters: {
    from_date?: string;
    to_date?: string;
  };
}
