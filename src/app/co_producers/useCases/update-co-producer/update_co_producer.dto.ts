export interface UpdateCoProducerDTO {
  product_id: string;
  co_producer_id: string;
  commission?: number;
  commission_order_bump?: number;
  producer_id: string;
}
