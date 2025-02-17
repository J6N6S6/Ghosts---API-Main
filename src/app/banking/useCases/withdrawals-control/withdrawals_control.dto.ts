export interface WithdrawalsControlDTO {
  type: 'approved' | 'rejected' | 'pending';
  page: number;
  items_per_page: number;
  search?: string;
}
