import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RefundRequestService } from '../services/refund_request.service';

import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';

import { ListAllRequestsRefundDTO } from '../useCases/listAllRequestsRefund/list_all_requests_refunds.dto';
import { IsAssistent } from '@/app/auth/decorators/endpoint-assistent.decorator';

@Controller('@admin/refunds')
export class AdminRefundRequestController {
  constructor(private readonly refundRequestService: RefundRequestService) {}
  @Get('')
  @IsAssistent()
  async getAllRequets(
    @Query()
    data: ListAllRequestsRefundDTO,
  ) {
    const results = await this.refundRequestService.listAllRefunds(data);
    return {
      hasError: false,
      data: results,
    };
  }

  @Post('approve-refund/:refund_request_id')
  @IsAssistent()
  async approveRefund(
    @Param('refund_request_id')
    refund_request_id: string,
  ) {
    const results = await this.refundRequestService.approveRefund(
      refund_request_id,
    );

    return {
      hasError: false,
      data: results,
    };
  }

  @Post('reject-refund/:refund_request_id')
  @IsAssistent()
  async rejectRefund(
    @Param('refund_request_id')
    refund_request_id: string,
  ) {
    const results = await this.refundRequestService.rejectRefund(
      refund_request_id,
    );

    return {
      hasError: false,
      data: results,
    };
  }

  @Post('confirm-payment/:refund_request_id')
  @IsAssistent()
  async confirmPayment(
    @Param('refund_request_id')
    refund_request_id: string,
  ) {
    const results = await this.refundRequestService.confirmPaymentManual(
      refund_request_id,
    );

    return {
      hasError: false,
      data: results,
    };
  }

  @Post('manual-refund/:transaction_id')
  @IsAssistent()
  async manualRefund(
    @Param('transaction_id')
    transaction_id: string,
  ) {
    const results = await this.refundRequestService.refundManual(
      transaction_id,
    );

    return {
      hasError: false,
      data: results,
    };
  }

  @Post('automatic-refund/:transaction_id')
  @IsAssistent()
  async automaticRefund(
    @Param('transaction_id')
    transaction_id: string,
  ) {
    const results = await this.refundRequestService.automaticRefund(
      transaction_id,
    );

    return {
      hasError: false,
      data: results,
    };
  }
}
