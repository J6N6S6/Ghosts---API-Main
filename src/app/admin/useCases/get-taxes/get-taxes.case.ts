import { Injectable } from '@nestjs/common';
import { TaxesRepository } from '@/domain/repositories';
import { Tax } from '@/domain/models/tax.model';

@Injectable()
export class GetTaxesCase {
  constructor(private readonly taxesRepository: TaxesRepository) {}

  async execute() {
    const taxes = await this.taxesRepository.findAll();

    taxes.sort((a: Tax, b: Tax) =>
      a.id === 'default' ? -1 : b.id === 'default' ? 1 : 0,
    );

    return taxes;
  }
}
