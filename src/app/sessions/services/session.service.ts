import { CreateNewSessionCase } from '../useCases/createNewSessionCase/createNewSession';
import { RefundManualCase } from '../useCases/refundManual/refundManualCase';
import { Injectable } from '@nestjs/common';

import { RejectRefundCase } from '../useCases/rejectRefund/reject_refund.case';
import { CreateNewSessionDto } from '../useCases/createNewSessionCase/createNewSession.dto';
import { ListAllSessionsCase } from '../useCases/listAllSessions/list_all_requests_refund.case';

@Injectable()
export class SessionService {
  constructor(
    private readonly listAllSessionsCase: ListAllSessionsCase,

    private readonly rejectRefundCase: RejectRefundCase,

    private readonly refundManualCase: RefundManualCase,
    private readonly createNewSessionCase: CreateNewSessionCase,
  ) {}

  async CreateNewSessionCase(data: CreateNewSessionDto) {
    return this.createNewSessionCase.execute(data);
  }

  async listAllSessions(data: any) {
    return this.listAllSessionsCase.execute(data);
  }

  async rejectRefund(RefundRequestId: string) {
    return this.rejectRefundCase.execute(RefundRequestId);
  }

  async confirmPaymentManual(RefundRequestId: string) {
    return;
  }

  async refundManual(transactionId: string) {
    return this.refundManualCase.execute(transactionId);
  }
}
