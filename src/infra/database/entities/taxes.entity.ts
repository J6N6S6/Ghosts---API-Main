import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('taxes')
export class Taxes {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb' })
  withdrawal_fee: {
    percentage: number;
    fixed_amount: number;
  };

  @Column({ type: 'jsonb' })
  security_reserve_fee: {
    '30d': { percentage: number; fixed_amount: number };
    '15d': { percentage: number; fixed_amount: number };
    '7d': { percentage: number; fixed_amount: number };
    [x: string]: { percentage: number; fixed_amount: number };
  };

  @Column({ type: 'jsonb' })
  payment_fee: {
    pix: {
      percentage: number;
      fixed_amount: number;
    };
    bank_slip: {
      percentage: number;
      fixed_amount: number;
    };
    card: {
      '30d': { percentage: number; fixed_amount: number };
      '15d': { percentage: number; fixed_amount: number };
      '7d': { percentage: number; fixed_amount: number };
      [x: string]: { percentage: number; fixed_amount: number };
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  secure_reserve_config: {
    reserve_time: string;
    reserve_percentage: number;
  };
}
