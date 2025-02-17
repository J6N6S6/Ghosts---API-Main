import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { Injectable } from '@nestjs/common';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { ServerException } from '@/infra/exception/server.exception';
import { UserIntegrationsModel } from '@/domain/models/user_integrations.model';
import { CreateOrderDTO } from './create-order.dto';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';

@Injectable()
export class CreateUtmfyOrderCase {
  constructor(
    private readonly userIntegrationsRepository: UserIntegrationsRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute({ user_id, transaction }: CreateOrderDTO) {
    console.log('CreateUtmfyOrderCase.execute', { user_id });
    const integrations = await this.userIntegrationsRepository.findByUserId(
      user_id,
    );

    console.log('integrations', integrations);

    if (!integrations || !integrations.utmfy) {
      return '';
    }

    const utmfy_api_token = integrations.utmfy.api_token;

    const utmfyTransactionStatus = {
      PENDING: 'waiting_payment',
      AUTHORIZED: 'paid',
      CANCELED: 'refused',
      REFUNDED: 'refunded',
      CHARGEBACK: 'chargedback',
    };

    const utmfyPaymentMethod = {
      CREDIT_CARD: 'credit_card',
      BANK_SLIP: 'boleto',
      PIX: 'pix',
    };

    const user_commission = transaction.split_accounts.find(
      (item) => item.account_id === user_id,
    );

    const payload = {
      orderId: transaction.id,
      platform: 'projectx Pay',
      paymentMethod: utmfyPaymentMethod[transaction.payment_method],
      status: utmfyTransactionStatus[transaction.status],
      createdAt: transaction.date_created,
      approvedDate: transaction.date_approved, // Subtraindo 3 horas, se aprovado
      refundedAt: null, // UTC
      customer: {
        name: transaction.buyer.name,
        email: transaction.buyer.email,
        phone: transaction.buyer.phone,
        document: transaction.buyer.document,
      },
      products: [
        {
          id: transaction.product.id,
          name: transaction.product.title,
          quantity: 1,
          priceInCents: this.convertToCents(transaction.transaction_amount),
          planId: null,
          planName: null,
        },
      ],
      trackingParameters: {
        src: '',
        sck: '',
        utm_source: transaction.buyer.utm_source,
        utm_medium: transaction.buyer.utm_medium,
        utm_campaign: transaction.buyer.utm_campaign,
        utm_term: transaction.buyer.utm_term,
        utm_content: transaction.buyer.utm_content,
      },
      commission: {
        totalPriceInCents: this.convertToCents(transaction.transaction_amount),
        userCommissionInCents: this.convertToCents(user_commission.amount),
        gatewayFeeInCents: this.convertToCents(user_commission.amount_tax),
        currency: 'BRL',
      },
    };

    console.log('UTMFY PAYLOAD: ', payload);

    try {
      const { data } = await this.httpService.axiosRef.post(
        'https://api.utmify.com.br/api-credentials/orders',
        payload,
        {
          headers: {
            'x-api-token': utmfy_api_token,
          },
        },
      );
    } catch (error) {
      console.log('ERROR response: ', error.response.data);
      throw new ServerException('Error on create utmfy order');
    }

    return '';
  }

  convertToCents(amount: number): number {
    return Math.round(amount * 100);
  }
}
