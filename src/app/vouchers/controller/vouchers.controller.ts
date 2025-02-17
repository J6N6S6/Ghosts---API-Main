import { Vouchers } from '@/infra/database/entities/vouchers.entity';
import { HttpResponse } from '@/shared/@types/HttpResponse';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VouchersService } from '../services/vouchers.service';
import { UserIsProductOwner } from '@/shared/decorators/user-is-product-owner.decorator';
import { CreateVoucherBody } from '../validators/CreateVoucher.body';
import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';

@Controller('products/vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Post('create/:product_id')
  @UserIsProductOwner()
  async createVoucher(
    @Param('product_id') product_id: string,
    @Body() body: CreateVoucherBody,
  ): Promise<HttpResponse<Vouchers>> {
    const voucher = await this.vouchersService.createVoucher({
      product_id,
      ...body,
    });

    return {
      hasError: false,
      data: voucher,
    };
  }

  @Put('update/:product_id/:voucher_id')
  @UserIsProductOwner()
  async editVoucher(
    @Param('voucher_id') voucher_id: string,
    @Body() body: CreateVoucherBody,
  ): Promise<HttpResponse> {
    await this.vouchersService.updateVoucher({
      voucher_id,
      ...body,
    });

    return {
      hasError: false,
      message: 'Cupom editado com sucesso!',
    };
  }

  @Get('list/:product_id')
  @UserIsProductOwner()
  async listVouchers(
    @Param('product_id') product_id: string,
  ): Promise<HttpResponse<Vouchers[]>> {
    const vouchers = await this.vouchersService.listVouchers(product_id);

    return {
      hasError: false,
      data: vouchers,
    };
  }

  @Delete('delete/:product_id/:voucher_id')
  @UserIsProductOwner()
  async deleteVoucher(
    @Param('voucher_id') voucher_id: string,
  ): Promise<HttpResponse<void>> {
    await this.vouchersService.deleteVoucher(voucher_id);

    return {
      hasError: false,
      message: 'Cupom deletado com sucesso!',
    };
  }

  @Get('verify/:product_id/:voucher_hash')
  @IsPublic()
  async verifyVoucher(
    @Param('product_id') product_id: string,
    @Param('voucher_hash') voucher_hash: string,
  ): Promise<HttpResponse<Vouchers>> {
    const voucher = await this.vouchersService.verifyVoucher({
      product_id,
      voucher_hash,
    });

    return {
      hasError: false,
      data: voucher,
    };
  }
}
