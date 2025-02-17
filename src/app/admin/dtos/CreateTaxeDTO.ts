export interface CreateTaxeDTO {
  id: string;
  pix_payment_fee: number;
  pix_fixed_amount: number;
  bank_slip_payment_fee: number;
  bank_slip_fixed_amount: number;
  withdrawal_fee: number;
  withdrawal_fixed_amount: number;
  secure_reserve_fee: number;
  secure_reserve_time: string;
  '7d_card_payment_fee': number;
  '7d_card_fixed_amount': number;
  '15d_card_payment_fee': number;
  '15d_card_fixed_amount': number;
  '30d_card_payment_fee': number;
  '30d_card_fixed_amount': number;
}
