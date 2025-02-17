export interface SendPushCutWebhookDTO {
  user_id: string;
  notification_type:
    | 'MOBILE_GENERATED_PIX_AND_BANK_SLIP'
    | 'MOBILE_APPROVED_SALES';
}
