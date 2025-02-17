export interface UpdateGeneralSettingsDTO {
  user_id: string;
  product_id: string;

  allow_affiliate?: boolean;
  affiliate_commission?: number;
  affiliate_commission_orderbump?: number;
  affiliate_automatically_approve?: boolean;
  affiliate_assignment?: 'LAST_CLICK' | 'FIRST_CLICK';

  allow_marketplace?: boolean;
  marketplace_support_email?: string;
  marketplace_description?: string;
  marketplace_checkout_link?: string;
}
