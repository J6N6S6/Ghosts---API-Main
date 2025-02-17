export interface IInviteCoProducerDTO {
  co_producer_email: string;
  commission: number;
  commission_order_bump?: number;

  product_id: string;
  producer_id: string;
}
