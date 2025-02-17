export interface ListMarketplaceProductsDTO {
  page: number;
  limit: number;
  category_id?: string;
  order_by?: 'MOST_RECENT' | 'MOST_SALES' | 'MOST_RATING';
  search?: string;
}
