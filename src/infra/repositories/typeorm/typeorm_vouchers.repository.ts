import { Voucher } from '@/domain/models/vouchers.model';
import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { Vouchers } from '@/infra/database/entities/vouchers.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormVouchersRepository implements VouchersRepository {
  constructor(
    @InjectRepository(Vouchers)
    private readonly vouchersRepository: Repository<Vouchers>,
  ) {}

  async create(data: Voucher): Promise<void> {
    await this.vouchersRepository.save({
      code: data.code,
      discount: data.discount,
      deadline: data.deadline,
      createdAt: data.createdAt,
      discount_type: data.discount_type,
      id: data.id,
      product_id: data.product_id,
      updatedAt: data.updatedAt,
    });
  }

  async update(data: Voucher): Promise<void> {
    await this.vouchersRepository.update(data.id, {
      discount: data.discount,
      deadline: data.deadline,
      discount_type: data.discount_type,
      code: data.code,
    });
  }

  async delete(id: string): Promise<void> {
    await this.vouchersRepository.delete(id);
  }

  async findAllByProduct(product_id: string): Promise<Vouchers[]> {
    return this.vouchersRepository.find({
      where: { product_id },
    });
  }

  findById(id: string): Promise<Vouchers> {
    return this.vouchersRepository.findOneBy({ id });
  }

  findByCodeAndProductId(code: string, product_id: string): Promise<Vouchers> {
    return this.vouchersRepository.findOneBy({ code, product_id });
  }
}
