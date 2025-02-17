import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { Injectable } from '@nestjs/common';
import { UpdateVoucherDTO } from '../../dtos/UpdateVoucherDTO';
import { Voucher } from '@/domain/models/vouchers.model';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class UpdateVoucherCase {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async execute({
    code,
    deadline,
    discount,
    voucher_id,
  }: UpdateVoucherDTO): Promise<void> {
    const findVoucher = await this.vouchersRepository.findById(voucher_id);

    if (!findVoucher) {
      throw new ClientException('Cupom não encontrado!');
    }

    const voucher = new Voucher(findVoucher);

    if (code) voucher.code = code;
    if (deadline) voucher.deadline = deadline;
    if (discount) voucher.discount = discount;

    await this.vouchersRepository.update(voucher);
  }
}
