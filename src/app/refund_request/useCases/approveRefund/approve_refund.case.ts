import { DisputeAcceptedPaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/dispute_accepted_payment.case';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { Transaction } from '@/domain/models/transaction.model';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApproveRefundCase {
  constructor(
    private readonly refundRequestRepository: IERefundRequestRepository,
    private readonly disputeAcceptedPaymentCase: DisputeAcceptedPaymentCase,
  ) {}

  async execute(refundRequestId: string) {
    const refundRequestFounded = await this.refundRequestRepository.findOne({
      where: { id: refundRequestId },
      relations: ['transaction'],
    });

    if (!refundRequestFounded) {
      throw new ClientException('Solicitação não encontrada', 404);
    }

    if (refundRequestFounded.transaction.status !== 'IN_DISPUTE') {
      throw new ClientException('Essa solicitação não está em disputa.', 400);
    }

    const refundRequest = new RefundRequestModel(refundRequestFounded);
    refundRequest.status = 'WAITING_REFUND_PAYMENT';

    await this.refundRequestRepository.update(refundRequest);

    const transactionModel = new Transaction(refundRequestFounded.transaction);

    await this.disputeAcceptedPaymentCase.execute({
      transaction: transactionModel,
    });

    return 'Solicitação aprovada com succeso, efetue o pagamento do reembolso.';
  }
}
