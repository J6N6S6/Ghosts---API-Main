export interface AffiliationActionControlDTO {
  user_id: string;
  product_id: string;
  affiliation_id: string;
  action: 'accept' | 'reject' | 'block' | 'unblock' | 'block-and-reject';
}
