export interface GetProductsMostRatingDTO {
  page: number;
  limit: number;
  search?: string;
  category_id?: string;
}
