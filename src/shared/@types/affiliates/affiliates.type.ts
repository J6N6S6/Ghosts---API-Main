export interface IAffliates {
  id: number;
  product_id: number;
  producer_id: string;
  user_id: string;
  type_comission: AffiliatesTypeComission;
  comission?: number;
  approved: boolean;
  key_of_links?: string;
  link_checkout?: string;
  link_external?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AffiliatesTypeComission {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}
