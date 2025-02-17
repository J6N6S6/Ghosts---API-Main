import { taxes_per_value } from '@/config/taxes';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { BankSlipPaymentResponse } from '../dtos/BankSlipPaymentResponse.dto';
import { CreateBankSlipPaymentDTO } from '../dtos/CreateBankSlipPayment.dto';
import { CreateCreditCardPaymentDTO } from '../dtos/CreateCreditCardPayment.dto';
import { CreatePixPaymentDTO } from '../dtos/CreatePixPayment.dto';
import { CreditCardPaymentResponse } from '../dtos/CreditCardPaymentResponse.dto';
import { GetStatusPayment } from '../dtos/GetStatusPayment.dto';
import { PixPaymentResponse } from '../dtos/PixPaymentResponse.dto';
import {
  ICalculatePaymentDTO,
  ICalculatePaymentResponse,
} from '../dtos/calculate_payment';
import { CieloService } from '../providers/cielo/cielo.service';
import { InterBankService } from '../providers/inter-bank/interbank.service';
import { MercadoPagoService } from '../providers/mercado-pago/mercadopago.service';
import { OpenPixService } from '../providers/openpix/openpix.service';
import { PaggueioService } from '../providers/paggueio/paggueio.service';
import { PagstarService } from '../providers/pagstar/pagstar.service';
import { Safe2PayService } from '../providers/safe2pay/safe2pay.service';
import { SaqPayService } from '../providers/saqpay/saqpay.service';
import { StarpayService } from '../providers/starpay/starpay.service';
import { SuitpayService } from '../providers/suitpay/suitpay.service';
import { GatewayProvider } from '../types/gateway_provider';
import { FirebankingService } from '../providers/firebanking/firebanking.service';
import { CelcoinService } from '../providers/celcoin/celcoin.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly safe2PayService: Safe2PayService,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly interBankService: InterBankService,
    private readonly pagstarService: PagstarService,
    private readonly openPixService: OpenPixService,
    private readonly suitpayService: SuitpayService,
    private readonly saqpayService: SaqPayService,
    private readonly paggueioService: PaggueioService,
    private readonly starPayService: StarpayService,
    private readonly cieloService: CieloService,
    private readonly firebankingService: FirebankingService,
    private readonly celcoinService: CelcoinService,
  ) {}

  private providers = {
    [GatewayProvider.SAFE2PAY]: this.safe2PayService,
    [GatewayProvider.MERCADO_PAGO]: this.mercadoPagoService,
    [GatewayProvider.INTER_BANK]: this.interBankService,
    [GatewayProvider.PAGSTAR]: this.pagstarService,
    [GatewayProvider.OPENPIX]: this.openPixService,
    [GatewayProvider.SUITPAY]: this.suitpayService,
    [GatewayProvider.SAQPAY]: this.saqpayService,
    [GatewayProvider.PAGGUEIO]: this.paggueioService,
    [GatewayProvider.STARPAY]: this.starPayService,
    [GatewayProvider.CIELO]: this.cieloService,
    [GatewayProvider.FIREBANKING]: this.firebankingService,
    [GatewayProvider.CELCOIN]: this.celcoinService,
  };

  getProvider(provider: GatewayProvider) {
    const providerService = this.providers[provider];

    if (!providerService) {
      throw new ServerException('Esse provider não é suportado', {
        provider,
      });
    }

    return providerService;
  }

  createPixPayment(
    data: CreatePixPaymentDTO,
    provider: GatewayProvider,
  ): Promise<PixPaymentResponse> {
    const providerService = this.getProvider(provider);
    return providerService.createPixPayment(data);
  }

  createCreditCardPayment(
    data: CreateCreditCardPaymentDTO,
    provider: GatewayProvider,
  ): Promise<CreditCardPaymentResponse> {
    const providerService = this.getProvider(provider);
    return providerService.createCreditCardPayment(data);
  }

  createBankSlipPayment(
    data: CreateBankSlipPaymentDTO,
    provider: GatewayProvider,
  ): Promise<BankSlipPaymentResponse> {
    const providerService = this.getProvider(provider);
    return providerService.createBankSlipPayment(data);
  }

  getTransactionStatus(
    payment_id: string,
    provider: GatewayProvider,
  ): Promise<GetStatusPayment> {
    const providerService = this.getProvider(provider);
    return providerService.getTransactionStatus(payment_id);
  }

  calculateTransactionSplits({
    total_value,
    cards,
    splits,
    tax_producer,
    additional_products,
    use_two_cards,
  }: ICalculatePaymentDTO): ICalculatePaymentResponse {
    let total_transaction_value = 0;

    // Cálculo do valor total com base nos cartões
    if (cards.length > 0) {
      if (use_two_cards) {
        for (const card of cards) {
          const { total_value: card_total_value } =
            this.calculateCardInstallments(card.amount, card.card_installment);
          total_transaction_value += card_total_value;
        }
      } else {
        const { total_value: card_total_value } =
          this.calculateCardInstallments(
            total_value,
            cards[0].card_installment,
          );
        total_transaction_value += card_total_value;
      }
    } else {
      total_transaction_value += total_value;
    }

    // Cálculo do valor total dos produtos adicionais
    let additionalProductsTotalValue = 0;
    if (additional_products) {
      for (const product of additional_products) {
        additionalProductsTotalValue += product.product_value;
      }
    }

    // Cálculo do valor do produto (total_value - valor dos produtos adicionais)
    const productValue = total_value - additionalProductsTotalValue;

    // Cálculo dos valores dos participantes
    let total_value_participants = 0;
    let total_participants_percentage = 0;

    const participants: ICalculatePaymentResponse['participants'] = splits.map(
      (split) => {
        const participantCommission = productValue * (split.commission / 100);
        const additionalProductsCommission =
          additionalProductsTotalValue * (split.commissionOrderBump / 100);
        const totalCommission =
          participantCommission + additionalProductsCommission;

        // No final do calculo, pegar taxa referente a commisao, exemplo
        // se ele tem 20% de commisao, a taxa dele e apenas 20% do valor
        const participantPercentageTax =
          totalCommission * (split.tax.percentage / 100);
        const participantFixedTax =
          split.tax.fixed_amount * (split.commission / 100);
        const participantTax = participantPercentageTax + participantFixedTax;

        const participantReceives =
          split.type !== 'INDICATED'
            ? totalCommission - participantTax
            : totalCommission;

        if (split.type !== 'INDICATED') {
          total_value_participants += totalCommission;
          total_participants_percentage += split.commission;
        }

        return {
          type: split.type,
          user_id: split.user_id,
          commission: split.commission,
          commissionOrderBump: split.commissionOrderBump,
          receives: Number(participantReceives.toFixed(2)),
          tax: Number(participantTax.toFixed(2)),
          days_to_receive: split.days_to_receive,
        };
      },
    );

    // Cálculo do valor que o produtor recebe
    const producerTotalCommission = total_value - total_value_participants;

    const producerPercentageTax =
      producerTotalCommission * (tax_producer.percentage / 100);
    const producerFixedTax =
      tax_producer.fixed_amount * ((100 - total_participants_percentage) / 100);
    const producerTax = producerPercentageTax + producerFixedTax;

    // const producerTax =
    //   (producerTotalCommission * (tax_producer.percentage / 100) +
    //     tax_producer.fixed_amount) *
    //   ((100 - total_participants_percentage) / 100);
    const producer_receives = producerTotalCommission - producerTax;

    // Cálculo das transações com base na quantidade de cartões (1 ou 2)
    const transactions: ICalculatePaymentResponse['transactions'] = [];
    if (cards.length > 0) {
      for (const card of cards) {
        const { total_value: card_total_value, tax } =
          this.calculateCardInstallments(card.amount, card.card_installment);
        transactions.push({
          installment: card.card_installment,
          amount: Number(card_total_value.toFixed(2)),
          tax: Number(tax.toFixed(2)),
        });
      }
    } else {
      transactions.push({
        installment: 1,
        amount: Number(total_transaction_value.toFixed(2)),
        tax: 0,
      });
    }

    const totalSecureReserve =
      total_value * (tax_producer.reserve_percentage / 100);

    return {
      total_transaction_value: Number(total_transaction_value.toFixed(2)),
      producer_receives: Number(producer_receives.toFixed(2)),
      producer_tax: Number(producerTax.toFixed(2)),
      participants,
      transactions,
      totalSecureReserve,
      secure_reserve_tax: tax_producer.reserve_percentage,
    };
  }

  calculateCardInstallments(
    value: number,
    installment: number,
  ): {
    installment: number;
    installment_value: number;
    total_value: number;
    tax: number;
  } {
    if (installment === 1)
      return {
        installment,
        installment_value: value,
        total_value: value,
        tax: 0,
      };

    const tax_installments = taxes_per_value.find(
      (installment) =>
        installment.min_value <= value &&
        (installment.max_value === null || installment.max_value >= value),
    )?.installments[installment];

    const total_value = value * (1 + tax_installments);

    // Calcular o valor da parcela com base na taxa
    const installment_value = total_value / installment;

    return {
      installment,
      installment_value,
      total_value,
      tax: total_value - value,
    };
  }
}
