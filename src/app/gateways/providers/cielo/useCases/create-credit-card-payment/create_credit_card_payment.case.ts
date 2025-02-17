import { CreateCreditCardPaymentDTO } from '@/app/gateways/dtos/CreateCreditCardPayment.dto';
import { CreditCardPaymentResponse } from '@/app/gateways/dtos/CreditCardPaymentResponse.dto';
import { PaymentStatus } from '@/app/ipn/types/payment_status.type';
import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateCreditCardPaymentResponseDTO } from './create_credit_card_payment_response.dto';

@Injectable()
export class CreateCreditCardPaymentCase {
  constructor(private readonly httpService: HttpService) {}

  async execute({
    payer,
    total_amount,
    transaction_id,
    card,
    installments,
  }: CreateCreditCardPaymentDTO): Promise<CreditCardPaymentResponse> {
    try {
      const card_number = card.number.replaceAll(' ', '');
      const card_brand = await this.getCardBrand(card_number.slice(0, 9));

      const request_data = {
        MerchantOrderId: transaction_id,
        Customer: {
          Name: this.formatName(payer.first_name, payer.last_name),
          Identity: payer.identification.number,
          IdentityType: payer.identification.type,
          Email: payer.email,
          Address: payer.address
            ? {
                Street: payer.address.street_name,
                Number: payer.address.street_number,
                ZipCode: payer.address.zip_code,
                City: payer.address.city,
                State: payer.address.federal_unit,
                Country: payer.address.country,
              }
            : undefined,
        },
        Payment: {
          Type: 'CreditCard',
          Amount: total_amount * 100, // cents
          Installments: installments,
          Authenticate: false,
          Capture: true,
          Interest: 'ByMerchant',
          SoftDescriptor: 'SUNIZE',
          CreditCard: {
            CardNumber: card_number,
            Holder: card.holder_name,
            ExpirationDate: card.expiration_date,
            SecurityCode: card.cvv,
            Brand: card_brand,
          },
        },
      };

      const request = await this.httpService.axiosRef.post(
        '/1/sales',
        request_data,
      );

      const data: CreateCreditCardPaymentResponseDTO = request.data;

      if (!data.Payment) {
        return {
          success: false,
          message: 'Error creating credit card payment',
        };
      }

      const transactionStatus = {
        0: PaymentStatus.PENDING,
        1: PaymentStatus.AUTHORIZED,
        2: PaymentStatus.AUTHORIZED,
        3: PaymentStatus.REJECTED,
        10: PaymentStatus.CANCELLED,
        11: PaymentStatus.REFUNDED,
        12: PaymentStatus.PENDING,
        13: PaymentStatus.REJECTED_BY_BANK,
      };

      return {
        success: true,
        data: {
          payment_id: data.Payment.PaymentId,
          status: transactionStatus[data.Payment.Status],
          status_detail: transactionStatus[data.Payment.Status],
          total_transaction_value: total_amount,
          capture: data.Payment.Capture,
          brand: card_brand,
          total_paid: Number((data.Payment.CapturedAmount / 100).toFixed(2)),
          use_tds: false,
          authorization_code: data.Payment.AuthorizationCode,
        },
      };
    } catch (error) {
      const errors = error.response?.data;

      const msg = 'Erro ao criar pagamento com cartão de crédito';
      let discord_error_detail = '';

      if (errors.length > 0) {
        const errors_codes: { [codigo: number]: string } = {
          0: 'Sucesso',
          1: 'Afiliado não encontrado',
          2: 'Fundos insuficientes',
          3: 'Não foi possível obter o cartão de crédito',
          4: 'Falha na conexão com o adquirente',
          5: 'Tipo de transação inválido',
          6: 'Plano de pagamento inválido',
          7: 'Negado',
          8: 'Agendado',
          9: 'Aguardando',
          10: 'Autenticado',
          11: 'Não autenticado',
          12: 'Problemas com o cartão de crédito',
          13: 'Cartão cancelado',
          14: 'Cartão de crédito bloqueado',
          15: 'Cartão expirado',
          16: 'Abortado por fraude',
          17: 'Não foi possível realizar a análise antifraude',
          18: 'Tentar novamente',
          19: 'Valor inválido',
          20: 'Problemas com o emissor',
          21: 'Número do cartão inválido',
          22: 'Tempo esgotado',
          23: 'Cartão Protegido não está ativado',
          24: 'Método de pagamento não está ativado',
          98: 'Solicitação inválida',
          99: 'Erro interno',
          999: 'Erro interno',
        };

        const discord_error = errors_codes[errors[0].Code];

        discord_error_detail = errors
          .map((error: any) => error.Message)
          .join(', ');

        // se status for 4xx, mostrar erro pro cliente, se for diretente, somente para o discord
        if (error.response.status >= 400 && error.response.status < 500) {
          throw new ClientException(msg + ': ' + errors_codes[errors[0].Code]);
        }

        console.log(errors);
        try {
          await axios.post(
            'https://discord.com/api/webhooks/1228555263418699808/MejTjui2AX7M8gdZSHkfaVtumIT-D32tn7tGiJEe7SKqa0NCYols80S__r6_P1K121sB',
            {
              content:
                'CIELO CREDIT CARD - ERROR: ' +
                discord_error +
                '\n DETALHES:' +
                discord_error_detail,
            },
          );
        } catch (err) {}
      }

      throw new ClientException(msg);
    }
  }

  formatName(first_name: string, last_name: string): string {
    if (last_name) {
      return first_name + ' ' + last_name;
    }

    return first_name;
  }

  async getCardBrand(bin: string): Promise<string> {
    const request = await this.httpService.axiosRef.get('/1/cardBin/' + bin, {
      baseURL: 'https://apiquery.cieloecommerce.cielo.com.br/',
    });
    const provider = request.data.Provider;

    if (provider === 'VISA') {
      return 'Visa';
    } else if (provider === 'MASTERCARD') {
      return 'Master';
    } else if (provider === 'AMEX') {
      return 'Amex';
    } else if (provider === 'ELO') {
      return 'Elo';
    } else if (provider === 'HIPERCARD') {
      return 'Hipercard';
    } else if (provider === 'DINERS') {
      return 'Diners';
    } else if (provider === 'DISCOVER') {
      return 'Discover';
    } else if (provider === 'JCB') {
      return 'JCB';
    } else if (provider === 'AURA') {
      return 'Aura';
    } else if (provider === 'CABAL') {
      return 'Cabal';
    } else {
      return 'Visa';
    }
  }
}
