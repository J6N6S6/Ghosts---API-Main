export interface ListAffiliationsDTO {
  user_id: string;
  products: string[];

  page: number;
  limit: number;
  status?: 'active' | 'pending' | 'rejected';
  search?: string;
}
