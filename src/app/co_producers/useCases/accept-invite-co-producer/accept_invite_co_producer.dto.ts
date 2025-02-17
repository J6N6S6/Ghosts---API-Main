export interface AcceptInviteCoProducerDTO {
  user_id: string;
  product_id: string;
  accepted: boolean;
  notification_id?: string;
}
