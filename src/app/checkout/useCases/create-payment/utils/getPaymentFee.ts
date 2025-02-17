import { Taxes } from '@/infra/database/entities';

type TaxFrequency = `${number}d`;
interface IGetPaymentFee {
  payment_method: 'CREDIT_CARD' | 'PIX' | 'BANK_SLIP';
  tax: Taxes;
  tax_frequency: TaxFrequency;
}

export function GetPaymentFee({
  payment_method,
  tax,
  tax_frequency,
}: IGetPaymentFee): {
  percentage: number;
  fixed_amount: number;
  reserve_time: '90d' | '30d' | '60d' | string;
  reserve_percentage: number;
} {
  if (payment_method === 'CREDIT_CARD') {
    return {
      ...tax.payment_fee.card[tax_frequency],
      ...tax.secure_reserve_config,
    };
  }

  return {
    ...tax.payment_fee[payment_method.toLowerCase()],
    ...tax.secure_reserve_config,
  };
}
