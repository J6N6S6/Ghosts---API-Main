import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyVoucherCase {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async execute(data: { voucher_hash: string; product_id: string }) {
    const voucher = await this.vouchersRepository.findByCodeAndProductId(
      data.voucher_hash,
      data.product_id,
    );

    if (!voucher || voucher.product_id !== data.product_id) {
      throw new ClientException('Cupom não encontrado!');
    }

    return voucher;
  }
}
