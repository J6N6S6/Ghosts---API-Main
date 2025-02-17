import { PaymentService } from '@/app/gateways/services/payment.service';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { ClientException } from '@/infra/exception/client.exception';
import { Transaction } from '@/domain/models/transaction.model';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Injectable } from '@nestjs/common';
import { ExecutePaymentDTO } from './execute_payment.dto';
import { getPhoneDDD, getPhoneWithoutDDD } from '../utils/getPhoneData';

@Injectable()
export class ExecuteCreditCardPaymentCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({
    payer,
    items,
    seller_name,
    total_value,
    transaction,
    card_data,
    installments = 1,
    product_gateway,
  }: ExecutePaymentDTO) {
    const gateway = await this.plataformSettingsRepository.findByKey(
      'GATEWAY_CREDIT_CARD',
    );

    if (!gateway) {
      throw new ClientException('Gateway de pagamento não encontrado');
    }

    const payment_gateway = product_gateway || gateway.value;

    const payment = await this.paymentService.createCreditCardPayment(
      {
        seller_name,
        total_amount: total_value,
        transaction_id: transaction.id,
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
        card_token: Boolean(card_data?.card_token),
        [card_data?.card_token ? 'token' : 'card']: card_data?.card_token
          ? card_data.card_token
          : {
              cvv: card_data.card_cvv,
              expiration_date: card_data.card_expiration_date,
              number: card_data.card_number,
              holder_name: card_data.card_holder_name,
            },
        installments: Number(installments),
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
      ...payment.data,
    };
    transactionModel.external_id = payment.data.payment_id;

    await this.transactionsRepository.update(transactionModel);

    return payment.data;
  }
}
