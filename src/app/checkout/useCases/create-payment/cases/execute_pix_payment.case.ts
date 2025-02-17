import { PaymentService } from '@/app/gateways/services/payment.service';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { generatePaymentId } from '@/app/ipn/utils/generateShortId';
import { Transaction } from '@/domain/models/transaction.model';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExecutePaymentDTO } from './execute_payment.dto';
import { getPhoneDDD, getPhoneWithoutDDD } from '../utils/getPhoneData';

@Injectable()
export class ExecutePixPaymentCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
    private readonly paymentService: PaymentService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    payer,
    items,
    seller_name,
    total_value,
    transaction,
    product_gateway,
  }: ExecutePaymentDTO) {
    const gateway = await this.plataformSettingsRepository.findByKey(
      'GATEWAY_PIX',
    );

    if (!gateway) {
      throw new ClientException('Gateway de pagamento não encontrado');
    }

    let external_id = null;

    const payment_gateway = product_gateway || gateway.value;

    if (payment_gateway === 'INTER_BANK') {
      external_id = generatePaymentId();
      let payment_id_unique = false;
      while (!payment_id_unique) {
        const product = await this.transactionsRepository.find({
          where: {
            external_id,
          },
          select: ['id'],
        });

        if (!product) {
          payment_id_unique = true;
        }
      }
    }

    const payment = await this.paymentService.createPixPayment(
      {
        seller_name,
        total_amount: total_value,
        transaction_id:
          payment_gateway === 'INTER_BANK' ? external_id : transaction.id,
        items,
        payer: {
          email: payer.email,
          identification: {
            type: payer.identity.length === 11 ? 'CPF' : 'CNPJ',
            number: payer.identity,
          },
          first_name: payer.first_name,
          last_name: payer.last_name,
          phone: {
            area_code: getPhoneDDD(payer.phone),
            number: getPhoneWithoutDDD(payer.phone),
          },
          address: payer?.address.street && {
            zip_code: payer?.address.cep,
            street_name: payer?.address.street,
            city: payer?.address.city,
            neighborhood: payer?.address.neighborhood,
            street_number: Number(payer?.address.number),
            federal_unit: payer?.address.state,
          },
        },
        date_expiration: new Date(
          new Date().getTime() + 6 * 60 * 60 * 1000, // 6 horas
        ).toISOString(),
      },
      GatewayProvider[payment_gateway],
    );

    const transactionModel = new Transaction(transaction);
    transactionModel.gateway = GatewayProvider[payment_gateway];
    if (!payment.success) {
      transactionModel.status = 'FAILED';
      transactionModel.additional_info = {
        ...transactionModel.additional_info,
        status_detail: payment.message,
        status_error: payment.error,
      };

      await this.transactionsRepository.update(transactionModel);
      throw new ClientException(payment.message);
    }

    transactionModel.status = 'PENDING';
    transactionModel.additional_info = {
      ...transactionModel.additional_info,
    };
    transactionModel.payment_method_details = {
      ...transactionModel.payment_method_details,
      pix_key: payment.data.pix_key,
      ...payment.data,
    };
    transactionModel.external_id = payment.data.payment_id;

    await this.transactionsRepository.update(transactionModel);
    this.eventEmitter.emit('transaction.pending', {
      transaction: transactionModel,
    });

    return payment.data;
  }
}
