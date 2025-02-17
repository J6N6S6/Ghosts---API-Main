import { DisputeRejectedPaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/dispute_rejected_payment.case';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { Transaction } from '@/domain/models/transaction.model';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RejectRefundCase {
  constructor(
    private readonly refundRequestRepository: IERefundRequestRepository,
    private readonly disputeRejectedPaymentCase: DisputeRejectedPaymentCase,
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

    if (refundRequestFounded.status !== 'PENDING') {
      throw new ClientException(
        'So é possivel recusar solitações que estão pendentes.',
        400,
      );
    }
    const refundRequest = new RefundRequestModel(refundRequestFounded);
    refundRequest.status = 'REJECTED';

    await this.refundRequestRepository.update(refundRequest);

    const transactionModel = new Transaction(refundRequestFounded.transaction);

    await this.disputeRejectedPaymentCase.execute({
      transaction: transactionModel,
      skipNotification: true,
      payment_data: {
        external_reference: transactionModel.id,
        payment_id: transactionModel.external_id,
        status: 'AUTHORIZED',
        status_detail: 'AUTHORIZED',
        total_paid_amount: transactionModel.transaction_amount,
        transaction_amount: transactionModel.transaction_amount,
        date_approved: new Date().toString(),
      },
    });

    return 'Solicitação de reembolso reprovada com succeso.';
  }
}
