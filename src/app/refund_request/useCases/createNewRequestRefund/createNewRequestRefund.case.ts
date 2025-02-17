import { Injectable } from '@nestjs/common';
import { CreateNewRefundRequestDto } from './createNewRequestRefund.dto';

import { InDisputePaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { ClientException } from '@/infra/exception/client.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { In } from 'typeorm';

@Injectable()
export class CreateNewRefundRequestCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly refundRequestRepository: IERefundRequestRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly inDisputePaymentCase: InDisputePaymentCase,
  ) {}

  async execute(data: CreateNewRefundRequestDto) {
    const transaction = await this.transactionsRepository.find({
      where: {
        id: data.transaction_id,
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

    const alreadyOpenedRequest = await this.refundRequestRepository.findOne({
      where: {
        transaction_id: data.transaction_id,
        status: In(['PENDING', `AUTHORIZED`]),
      },
      select: ['id', 'status'],
    });

    if (alreadyOpenedRequest) {
      throw new ClientException(
        alreadyOpenedRequest.status === 'PENDING'
          ? 'Já existe uma solicitação de reembolso aberta.'
          : 'Essa transação já foi reembolsada.',
        400,
      );
    }

    if (data.transaction_email !== transaction.buyer.email) {
      throw new ClientException(
        'Essa transação não foi feita com esse email.',
        403,
      );
    }

    const refundRequest = new RefundRequestModel({
      ...data,

      status: `PENDING`,
    });

    await this.refundRequestRepository.create(refundRequest);

    const transactionModel = new Transaction(transaction);

    await this.inDisputePaymentCase.execute({
      transaction: transactionModel,
    });

    return 'Reembolso solicitado com sucesso.';
  }
}
