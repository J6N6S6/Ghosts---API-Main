import { Tax } from '@/domain/models/tax.model';
import { TaxesRepository } from '@/domain/repositories/taxes.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TaxesSeed implements OnModuleInit {
  constructor(private readonly taxesRepository: TaxesRepository) {}

  async onModuleInit(): Promise<void> {
    const taxes = await this.taxesRepository.findAll();
    if (taxes.length >= 1) return;

    const defaultTax = new Tax({
      id: 'default',
      payment_fee: {
        pix: {
          percentage: 6.99,
          fixed_amount: 1.49,
        },
        bank_slip: {
          percentage: 6.99,
          fixed_amount: 1.49,
        },
        card: {
          '30d': { percentage: 6.99, fixed_amount: 1.49 },
          '15d': { percentage: 8.99, fixed_amount: 1.49 },
          '7d': { percentage: 9.99, fixed_amount: 2.49 },
        },
      },
      withdrawal_fee: {
        percentage: 0,
        fixed_amount: 3.49,
      },
      security_reserve_fee: {
        '30d': { percentage: 3, fixed_amount: 0 },
        '15d': { percentage: 7, fixed_amount: 0 },
        '7d': { percentage: 10, fixed_amount: 0 },
      },
      secure_reserve_config: {
        reserve_percentage: 10,
        reserve_time: '90d',
      },
    });

    const projectx = new Tax({
      id: 'projectx',
      payment_fee: {
        pix: {
          percentage: 6.99,
          fixed_amount: 1.49,
        },
        bank_slip: {
          percentage: 6.99,
          fixed_amount: 1.49,
        },
        card: {
          '30d': { percentage: 6.99, fixed_amount: 1.49 },
          '15d': { percentage: 8.99, fixed_amount: 1.49 },
          '7d': { percentage: 9.99, fixed_amount: 2.49 },
        },
      },
      withdrawal_fee: {
        percentage: 0,
        fixed_amount: 3.49,
      },
      security_reserve_fee: {
        '30d': { percentage: 3, fixed_amount: 0 },
        '15d': { percentage: 7, fixed_amount: 0 },
        '7d': { percentage: 10, fixed_amount: 0 },
      },
      secure_reserve_config: {
        reserve_percentage: 10,
        reserve_time: '90d',
      },
    });

    await this.taxesRepository.create(defaultTax);
    await this.taxesRepository.create(projectx);
  }
}
