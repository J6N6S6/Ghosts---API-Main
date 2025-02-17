export interface CreateProductDTO {
  title: string;
  description: string;
  price: number;
  category_id: string;
  user_id: string;
  payment_type: 'ONE_TIME' | 'SUBSCRIPTION';
  product_type: 'EBOOK' | 'ONLINE_COURSE' | 'LIVE_MENTORING' | 'FILES';
  image: Buffer;
  support_email: string;
  producer_name: string;
  support_phone: string;
  product_website: string;
  members_area: 'EXTERNAL' | 'INTERNAL' | 'CHECKOUT_ONLY';
  product_content_file?: Express.Multer.File;
  product_content_link?: string;
}
