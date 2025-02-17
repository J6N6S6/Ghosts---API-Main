export interface AdminProductsControlDTO {
  search: string;
  status:
    | 'IN_PRODUCTION'
    | 'IN_UPDATE'
    | 'IN_REVIEW'
    | 'ARCHIVED'
    | 'BLOCKED'
    | 'APPROVED'
    | 'REJECTED';

  page: number;
  limit: number;
}
