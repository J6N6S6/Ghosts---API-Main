import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { VouchersController } from './controller/vouchers.controller';
import { VouchersService } from './services/vouchers.service';
import { CreateVoucherCase } from './useCases/create-voucher/create_voucher.case';
import { DeleteVoucherCase } from './useCases/delete-voucher/delete_voucher.case';
import { ListAllVouchersCase } from './useCases/list-all-vouchers/list_all_vouchers.case';
import { UpdateVoucherCase } from './useCases/update-voucher/update_voucher.case';
import { VerifyVoucherCase } from './useCases/verify-voucher/verify_voucher.case';

@Module({
  imports: [InfraModule],
  controllers: [VouchersController],
  providers: [
    CreateVoucherCase,
    DeleteVoucherCase,
    ListAllVouchersCase,
    UpdateVoucherCase,
    VerifyVoucherCase,
    VouchersService,
  ],
  exports: [VouchersService],
})
export class VouchersModule {}
