import { Voucher } from '@/domain/models/vouchers.model';
import { VouchersRepository } from '@/domain/repositories/vouchers.repository';
import { VouchersDiscountType } from '@/shared/@types/vouchers/vouchers.type';
import { Injectable } from '@nestjs/common';
import { CreateVoucherDTO } from '../../dtos/CreateVoucherDTO';

@Injectable()
export class CreateVoucherCase {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async execute({ code, deadline, discount, product_id }: CreateVoucherDTO) {
    const voucher = new Voucher({
      code,
      deadline,
      discount,
      product_id,
      discount_type: VouchersDiscountType.FIXED,
    });

    await this.vouchersRepository.create(voucher);

    return voucher;
  }
}
