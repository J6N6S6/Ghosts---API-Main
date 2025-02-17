import { CreateCreditCardPaymentDTO } from '@/app/gateways/dtos/CreateCreditCardPayment.dto';
import { CreditCardPaymentResponse } from '@/app/gateways/dtos/CreditCardPaymentResponse.dto';
import { PaymentStatus } from '@/app/ipn/types/payment_status.type';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CreateCreditCardPaymentResponseDTO } from './create_credit_card_payment_response.dto';
import { SessionResponseDTO } from '../start-celcoin-session/session_response';
import { Inject, Injectable } from '@nestjs/common';
import { StartCelcoinSessionCase } from '../start-celcoin-session/start_celcoin_session.case';
import { addDays, format } from 'date-fns';

@Injectable()
export class CreateCreditCardPaymentCase {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly startSessionCase: StartCelcoinSessionCase,
  ) {}

  async execute({
    payer,
    total_amount,
    transaction_id,
    card,
    installments,
  }: CreateCreditCardPaymentDTO): Promise<CreditCardPaymentResponse | any> {
    let session = (await this.cacheManager.get(
      'celcoin_session',
    )) as SessionResponseDTO;

    if (!session || !session.access_token) {
      const newData = await this.startSessionCase.execute();
      console.log('NEW SESSION', newData);
      if (!newData || !newData.access_token) {
        return {
          success: false,
          message: 'Error starting cel coin session',
        };
      }

      session = newData;
    }

    try {
      const card_number = card.number.replaceAll(' ', '');

      const request_data = {
        myId: transaction_id,
        value: total_amount * 100,
        payday: format(addDays(new Date(), 0), 'yyyy-MM-dd'),
        payedOutsideGalaxPay: false,
        mainPaymentMethodId: 'creditcard',
        Customer: {
          myId: payer.id,
          name: this.formatName(payer.first_name, payer.last_name),
          document: payer.identification.number,
          emails: [payer.email],
          phones: [payer.phone],
        },
        PaymentMethodCreditCard: {
          Card: {
            myId: card_number,
            number: card.number,
            holder: card.holder_name,
            expiresAt: this.convertExpirationDate(card.expiration_date),
            cvv: card.cvv,
          },
          qtdInstallments: installments,
        },
      };

      const request = await this.httpService.axiosRef.post(
        '/charges',
        request_data,
      );

      const data: CreateCreditCardPaymentResponseDTO = request.data;

      console.log('RESPONDE DATA: ', data);

      if (!data.type) {
        return {
          success: false,
          message: 'Error creating credit card payment',
        };
      }

      const transactionStatus = {
        waitingPayment: PaymentStatus.PENDING,
        active: PaymentStatus.AUTHORIZED,
        inactive: PaymentStatus.CANCELLED,

        canceled: PaymentStatus.CANCELLED,
        denied: PaymentStatus.REJECTED_BY_BANK,
        reversed: PaymentStatus.REFUNDED,
        chargeback: PaymentStatus.CHARGEBACK,
        notSend: PaymentStatus.PENDING,
        closed: PaymentStatus.AUTHORIZED,
      };

      return {
        success: true,
        data: {
          payment_id: data.Charge.galaxPayId,
          status: transactionStatus[data.Charge.status] || 'CANCELLED',
          status_detail: data.Charge.Transactions[0].statusDescription,
          total_transaction_value: total_amount,

          total_paid: Number((data.Charge.value / 100).toFixed(2)),
          use_tds: false,
        },
      };
    } catch (error) {
      const cardIsInvalid = error.response.status === 400;
      if (cardIsInvalid) {
        return {
          success: false,
          message: 'Dados do cartão inválidos',
        };
      }
      console.log(
        'CreateCreditCardPaymentCase CELCOIN - ERROR: ',
        error.response,
      );
    }
  }

  formatName(first_name: string, last_name: string): string {
    if (last_name) {
      return first_name + ' ' + last_name;
    }

    return first_name;
  }

  convertExpirationDate(expirationDate) {
    // Divide a string para extrair o mês e o ano
    const [month, year] = expirationDate.split('/');

    // Retorna a data formatada no formato "YYYY-MM"
    return `${year}-${month.padStart(2, '0')}`;
  }
}

// const request_data = {
//   MerchantOrderId: transaction_id,
//   Customer: {
//     Name: this.formatName(payer.first_name, payer.last_name),
//     Identity: payer.identification.number,
//     IdentityType: payer.identification.type,
//     Email: payer.email,
//     Address: payer.address
//       ? {
//           Street: payer.address.street_name,
//           Number: payer.address.street_number,
//           ZipCode: payer.address.zip_code,
//           City: payer.address.city,
//           State: payer.address.federal_unit,
//           Country: payer.address.country,
//         }
//       : undefined,
//   },
//   Payment: {
//     Type: 'CreditCard',
//     Amount: total_amount * 100, // cents
//     Installments: installments,
//     Authenticate: false,
//     Capture: true,
//     Interest: 'ByMerchant',
//     SoftDescriptor: 'SUNIZE',
//     CreditCard: {
//       CardNumber: card_number,
//       Holder: card.holder_name,
//       ExpirationDate: card.expiration_date,
//       SecurityCode: card.cvv,
//     },
//   },
// };
