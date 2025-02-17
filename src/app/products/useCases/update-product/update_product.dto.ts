export class UpdateProductDTO {
  product_id: string;
  user_id: string;

  title?: string;
  description?: string;
  price?: number;
  payment_type?: 'ONE_TIME' | 'SUBSCRIPTION';
  support_email?: string;
  producer_name?: string;
  product_website?: string;
  support_phone?: string;
}
