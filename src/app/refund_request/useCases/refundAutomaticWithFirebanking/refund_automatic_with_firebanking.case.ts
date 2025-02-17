import { Injectable } from '@nestjs/common';

import { InDisputePaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { ClientException } from '@/infra/exception/client.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RefundedPaymentCase } from '@/app/ipn/useCases/create-transaction-ipn/useCases/refunded_payment.case copy';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { HttpService } from '@nestjs/axios';
import { Message } from 'twilio/lib/twiml/MessagingResponse';
import { ConfigService } from '@nestjs/config';
import { ServerException } from '@/infra/exception/server.exception';

@Injectable()
export class RefundAutomaticWithFirebankingCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly refundRequestRepository: IERefundRequestRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly RefundedPaymentCase: RefundedPaymentCase,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async execute(transaction_id) {
    const transaction = await this.transactionsRepository.find({
      where: {
        id: transaction_id,
      },
      relations: ['buyer'],
    });

    if (!transaction) {
      throw new ClientException('Transação não encontrada.', 404);
    }

    if (transaction.status !== 'AUTHORIZED') {
      throw new ClientException('Essa transação não foi concluida.', 400);
    }

    const transactionModel = new Transaction(transaction);

    if (transactionModel.gateway !== GatewayProvider.FIREBANKING) {
      throw new ClientException(
        'Essa transação não foi realizada com Firebanking.',
        400,
      );
    }

    const firebanking_transaction_id = transaction.external_id;

    const response = await this.httpService.axiosRef.post(
      `https://api.firebanking.io/payment/refund/${firebanking_transaction_id}`,
      {},
      {
        headers: {
          apiKey: this.configService.get('firebanking.api_key'),
          'Content-Type': 'application/json',
        },
      },
    );

    const data = response.data;

    if (!data) {
      throw new ServerException('Erro ao realizar reembolso na firebanking');
    }

    await this.RefundedPaymentCase.execute({
      transaction: transactionModel,
    });

    return 'Reembolso efetuado com sucesso.';
  }
}
