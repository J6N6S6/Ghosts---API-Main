export interface GetProductsMostSalesDTO {
  page: number;
  limit: number;
  search?: string;
  category_id?: string;
}
