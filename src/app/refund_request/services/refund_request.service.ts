import { RefundManualCase } from './../useCases/refundManual/refundManualCase';
import { Injectable } from '@nestjs/common';
import { CreateNewRefundRequestCase } from '../useCases/createNewRequestRefund/createNewRequestRefund.case';
import { CreateNewRefundRequestDto } from '../useCases/createNewRequestRefund/createNewRequestRefund.dto';
import { ListAllRequestsRefundCase } from '../useCases/listAllRequestsRefund/list_all_requests_refund.case';
import { ListAllRequestsRefundDTO } from '../useCases/listAllRequestsRefund/list_all_requests_refunds.dto';
import { ApproveRefundCase } from '../useCases/approveRefund/approve_refund.case';
import { RejectRefundCase } from '../useCases/rejectRefund/reject_refund.case';
import { ConfirmPaymentManualCase } from '../useCases/confirmPaymentManual/confirm_payment_manual.case';
import { RefundAutomaticWithFirebankingCase } from '../useCases/refundAutomaticWithFirebanking/refund_automatic_with_firebanking.case';

@Injectable()
export class RefundRequestService {
  constructor(
    private readonly createNewRefundRequestCase: CreateNewRefundRequestCase,
    private readonly listAllRequestsRefundCase: ListAllRequestsRefundCase,
    private readonly approveRefundCase: ApproveRefundCase,
    private readonly rejectRefundCase: RejectRefundCase,
    private readonly confirmPaymentManualCase: ConfirmPaymentManualCase,
    private readonly refundManualCase: RefundManualCase,
    private readonly automaticRefundWithFirebankingCase: RefundAutomaticWithFirebankingCase,
  ) {}

  async createNewRefundRequest(data: CreateNewRefundRequestDto) {
    return this.createNewRefundRequestCase.execute(data);
  }

  async listAllRefunds(data: ListAllRequestsRefundDTO) {
    return this.listAllRequestsRefundCase.execute(data);
  }

  async approveRefund(RefundRequestId: string) {
    return this.approveRefundCase.execute(RefundRequestId);
  }

  async rejectRefund(RefundRequestId: string) {
    return this.rejectRefundCase.execute(RefundRequestId);
  }

  async confirmPaymentManual(RefundRequestId: string) {
    return this.confirmPaymentManualCase.execute(RefundRequestId);
  }

  async refundManual(transactionId: string) {
    return this.refundManualCase.execute(transactionId);
  }

  async automaticRefund(transactionId: string) {
    return this.automaticRefundWithFirebankingCase.execute(transactionId);
  }
}
