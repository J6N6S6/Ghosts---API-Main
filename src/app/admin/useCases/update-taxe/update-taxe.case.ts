import { Injectable } from '@nestjs/common';
import { TaxesRepository } from '@/domain/repositories';
import { CreateTaxeDTO } from '../../dtos/CreateTaxeDTO';
import { Tax } from '@/domain/models/tax.model';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class UpdateTaxeCase {
  constructor(private readonly taxesRepository: TaxesRepository) {}

  async execute(data: CreateTaxeDTO) {
    const tax = await this.taxesRepository.findById(data.id);

    if (!tax) {
      throw new ClientException('Taxa não encontrada', 404);
    }

    const taxUpdated = new Tax({
      id: data.id,
      payment_fee: {
        pix: {
          percentage: data.pix_payment_fee,
          fixed_amount: data.pix_fixed_amount,
        },
        bank_slip: {
          percentage: data.bank_slip_payment_fee,
          fixed_amount: data.bank_slip_fixed_amount,
        },
        card: {
          '30d': {
            percentage: data['30d_card_payment_fee'],
            fixed_amount: data['30d_card_fixed_amount'],
          },
          '15d': {
            percentage: data['15d_card_payment_fee'],
            fixed_amount: data['15d_card_fixed_amount'],
          },
          '7d': {
            percentage: data['7d_card_payment_fee'],
            fixed_amount: data['7d_card_fixed_amount'],
          },
        },
      },
      withdrawal_fee: {
        percentage: data.withdrawal_fee,
        fixed_amount: data.withdrawal_fixed_amount,
      },
      security_reserve_fee: {
        '30d': { percentage: 3, fixed_amount: 0 },
        '15d': { percentage: 7, fixed_amount: 0 },
        '7d': { percentage: 10, fixed_amount: 0 },
      },
      secure_reserve_config: {
        reserve_percentage: data.secure_reserve_fee,
        reserve_time: data.secure_reserve_time,
      },
    });

    await this.taxesRepository.update(taxUpdated);

    return `Taxa atualizada com sucesso`;
  }
}
