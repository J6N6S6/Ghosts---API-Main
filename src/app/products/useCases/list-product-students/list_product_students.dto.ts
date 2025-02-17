export interface ListProductStudentsDTO {
  product_id: string;
  user_id: string;
  search?: string;
  page?: number;
  limit?: number;
}
