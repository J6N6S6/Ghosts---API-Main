import { Tax } from '@/domain/models/tax.model';
import { TaxesRepository } from '@/domain/repositories/taxes.repository';
import { Taxes } from '@/infra/database/entities/taxes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormTaxesRepository implements TaxesRepository {
  constructor(
    @InjectRepository(Taxes)
    private readonly taxesRepository: Repository<Taxes>,
  ) {}

  async create(data: Tax): Promise<void> {
    await this.taxesRepository.save(data.allProps);
  }

  async update(data: Tax): Promise<void> {
    await this.taxesRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<Taxes> {
    return this.taxesRepository.findOne({
      where: { id },
    });
  }

  findAll(): Promise<Taxes[]> {
    return this.taxesRepository.find();
  }
}
