import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteVoucherCase {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async execute(voucher_id: string) {
    await this.vouchersRepository.delete(voucher_id);
  }
}
