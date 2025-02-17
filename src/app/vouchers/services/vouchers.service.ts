import { Vouchers } from '@/infra/database/entities/vouchers.entity';
import { Injectable } from '@nestjs/common';
import { CreateVoucherDTO } from '../dtos/CreateVoucherDTO';
import { UpdateVoucherDTO } from '../dtos/UpdateVoucherDTO';
import { CreateVoucherCase } from '../useCases/create-voucher/create_voucher.case';
import { DeleteVoucherCase } from '../useCases/delete-voucher/delete_voucher.case';
import { ListAllVouchersCase } from '../useCases/list-all-vouchers/list_all_vouchers.case';
import { UpdateVoucherCase } from '../useCases/update-voucher/update_voucher.case';
import { VerifyVoucherCase } from '../useCases/verify-voucher/verify_voucher.case';

@Injectable()
export class VouchersService {
  constructor(
    private readonly createVoucherCase: CreateVoucherCase,
    private readonly deleteVoucherCase: DeleteVoucherCase,
    private readonly listAllVouchersCase: ListAllVouchersCase,
    private readonly updateVoucherCase: UpdateVoucherCase,
    private readonly verifyVoucherCase: VerifyVoucherCase,
  ) {}

  async createVoucher(data: CreateVoucherDTO): Promise<Vouchers> {
    return this.createVoucherCase.execute(data);
  }

  async deleteVoucher(id: string): Promise<void> {
    return this.deleteVoucherCase.execute(id);
  }

  async updateVoucher(data: UpdateVoucherDTO): Promise<void> {
    return this.updateVoucherCase.execute(data);
  }

  async listVouchers(product_id: string): Promise<Vouchers[]> {
    return this.listAllVouchersCase.execute(product_id);
  }

  async verifyVoucher(data: {
    voucher_hash: string;
    product_id: string;
  }): Promise<Vouchers> {
    return this.verifyVoucherCase.execute(data);
  }
}
