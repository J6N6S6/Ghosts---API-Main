import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { Injectable } from '@nestjs/common';

import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class ConfirmPaymentAutomaticCase {
  constructor(
    private readonly refundRequestRepository: IERefundRequestRepository,
  ) {}

  async execute(refundRequestId: string) {
    return 'Pagamento confirmado com succeso.';
  }
}
