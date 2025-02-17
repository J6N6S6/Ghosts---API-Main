export interface UpdateProductBannerDTO {
  product_id: string;
  banner: Buffer | null;
  banner_type: 'primary' | 'secondary';
  user_id: string;
}
