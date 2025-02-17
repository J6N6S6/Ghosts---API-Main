import { Tax } from '@/domain/models/tax.model';
import { Taxes } from '@/infra/database/entities/taxes.entity';

export abstract class TaxesRepository {
  abstract create(data: Tax): Promise<void>;
  abstract update(data: Tax): Promise<void>;
  abstract findById(id: string): Promise<Taxes>;
  abstract findAll(): Promise<Taxes[]>;
}
