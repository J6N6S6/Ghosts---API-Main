export interface UpdatePixelDTO {
  content?: string;
  domain?: string;
  pixel_id: string;
  purchase_event_pix?: boolean;
  purchase_event_bank_slip?: boolean;
}
