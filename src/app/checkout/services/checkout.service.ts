import { Injectable } from '@nestjs/common';
import { CreatePaymentCase } from '../useCases/create-payment/create_payment.case';
import { ICreatePaymentDTO } from '../useCases/create-payment/create_payment.dto';
import { GetPaymentStatusCase } from '../useCases/get-payment-status/get_payment_status.case';
import { GetProductCheckoutCase } from '../useCases/get-product-checkout/get_product_checkout.case';
import { SendMetaMetricsCase } from '../useCases/send-meta-metrics/send_meta_metrics.case';
import { SendMetaMetricsDTO } from '../useCases/send-meta-metrics/send_meta_metrics.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly createPaymentCase: CreatePaymentCase,
    private readonly getPaymentStatusCase: GetPaymentStatusCase,
    private readonly getProductCheckoutCase: GetProductCheckoutCase,
    private readonly sendMetaMetricsCase: SendMetaMetricsCase,
  ) {}

  getPaymentStatus(order_id: string) {
    return this.getPaymentStatusCase.execute(order_id);
  }

  pay(data: ICreatePaymentDTO) {
    return this.createPaymentCase.execute(data);
  }

  getProductCheckout(short_id: string, affiliate_id?: string) {
    return this.getProductCheckoutCase.execute(short_id, affiliate_id);
  }

  sendMetricsMeta(data: SendMetaMetricsDTO) {
    return this.sendMetaMetricsCase.execute(data);
  }
}
