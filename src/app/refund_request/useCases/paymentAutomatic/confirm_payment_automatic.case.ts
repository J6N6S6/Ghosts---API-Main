import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { Injectable } from '@nestjs/common';
import { RefundRequestDTO } from '../../dtos/RefundRequestDTO';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class ConfirmPaymentAutomaticCase {
  constructor(
    private readonly refundRequestRepository: IERefundRequestRepository,
  ) {}

  async execute(refundRequestId: string) {
    const refundRequestFounded: RefundRequestDTO =
      await this.refundRequestRepository.findById(refundRequestId);

    if (!refundRequestFounded) {
      throw new ClientException('Solicitação não encontrada.', 404);
    }

    if (refundRequestFounded.status !== 'WAITING_REFUND_PAYMENT') {
      throw new ClientException(
        'So é possivel confirmar o pagamento de uma transação que está aguardando pagamento.',
        400,
      );
    }

    const refundRequest = new RefundRequestModel(refundRequestFounded);
    refundRequest.status = 'CONCLUDED';

    await this.refundRequestRepository.update(refundRequest);

    return 'Pagamento confirmado com succeso.';
  }
}
