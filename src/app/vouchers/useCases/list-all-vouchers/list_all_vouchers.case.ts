import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { Vouchers } from '@/infra/database/entities/vouchers.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAllVouchersCase {
  constructor(private vouchersRepository: VouchersRepository) {}

  async execute(product_id: string): Promise<Vouchers[]> {
    return this.vouchersRepository.findAllByProduct(product_id);
  }
}
