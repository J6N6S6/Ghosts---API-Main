export interface AddProductOrderbumpDTO {
  product_id: string;

  bump_id: string;
  product_link: string | null;
  sell_phrase?: string;
  aux_phrase?: string;
  image: Buffer;
}
