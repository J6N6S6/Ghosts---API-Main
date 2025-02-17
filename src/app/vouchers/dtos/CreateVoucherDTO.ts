export interface CreateVoucherDTO {
  code: string;
  product_id: string;
  discount: number;
  deadline: Date;
}
