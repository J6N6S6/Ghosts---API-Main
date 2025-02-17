import { Vouchers } from '@/infra/database/entities/vouchers.entity';

export type IVoucher = Vouchers;

export enum VouchersDiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}
