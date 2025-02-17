import { Injectable } from '@nestjs/common';

import { InDisputePaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { ClientException } from '@/infra/exception/client.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { In } from 'typeorm';
import { RefundManualDto } from './refundManualDto';

@Injectable()
export class RefundManualCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly refundRequestRepository: IERefundRequestRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly inDisputePaymentCase: InDisputePaymentCase,
  ) {}

  async execute(transaction_id) {
    const transaction = await this.transactionsRepository.find({
      where: {
        id: transaction_id,
      },
      relations: ['buyer', 'seller', 'product'],
      // select: {
      //   id: true,
      //   buyer: {
      //     id: true,
      //     email: true,
      //   },
      //   seller: {
      //     id: true,
      //     email: true,
      //     name: true,
      //   },
      // },
    });

    if (!transaction) {
      throw new ClientException('Transação não encontrada.', 404);
    }

    if (transaction.status !== 'AUTHORIZED') {
      throw new ClientException('Essa transação não foi concluida.', 400);
    }

    const refundRequest = new RefundRequestModel({
      status: `CONCLUDED`,
      transaction_id: transaction_id,
      buyer_document: '',
      buyer_name: 'manual',
      buyer_phone: 'manual',
      pix_key: 'manual',

      reason: 'manual',
      transaction_email: 'manual@gmail.com',
    });

    await this.refundRequestRepository.create(refundRequest);

    const transactionModel = new Transaction(transaction);

    await this.inDisputePaymentCase.execute({
      transaction: transactionModel,
    });

    return 'Reembolso manual efetuado com sucesso.';
  }
}
