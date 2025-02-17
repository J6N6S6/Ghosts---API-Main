export interface AdminChangeProductStatusDTO {
  product_id: string;
  status:
    | 'IN_PRODUCTION'
    | 'IN_UPDATE'
    | 'IN_REVIEW'
    | 'ARCHIVED'
    | 'BLOCKED'
    | 'APPROVED'
    | 'REJECTED';
  status_reason: string;
}
