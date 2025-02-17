import { Injectable } from '@nestjs/common';
import { TaxesRepository } from '@/domain/repositories';
import { Tax } from '@/domain/models/tax.model';

@Injectable()
export class GetTaxeCase {
  constructor(private readonly taxesRepository: TaxesRepository) {}

  async execute(taxeId: string) {
    const taxe = await this.taxesRepository.findById(taxeId);

    return taxe;
  }
}
