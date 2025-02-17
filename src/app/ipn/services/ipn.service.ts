import { InterPJIpn } from '@/app/gateways/providers/inter-bank/dtos/InterPJIpn.dto';
import { Injectable } from '@nestjs/common';
import { ISafe2PayIpn } from '../dtos/safe2pay_ipn';
import { InterpjIpnCase } from '../useCases/interpj-ipn/interpj.ipn.case';
import { MercadoPagoIpnCase } from '../useCases/mercadopago-ipn/mercadopago.ipn.case';
import { OpenPixIpnCase } from '../useCases/openpix-ipn/openpix.ipn.case';
import { PagstarIpnCase } from '../useCases/pagstar-ipn/pagstar.ipn.case';
import { Safe2PayIpnCase } from '../useCases/safe2pay-ipn/safe2pay.ipn.case';
import { SuitpayIpnCase } from '../useCases/suitpay-ipn/suitpay.ipn.case';
import { SaqPayIpnCase } from '../useCases/saqpay-ipn/saqpay.ipn.case';
import { OpenPixIpnDTO } from '../useCases/openpix-ipn/openpix.ipn.dto';
import { PaggueioIpnCase } from '../useCases/paggueio-ipn/paggueio.ipn.case';
import { PaggueioDTO } from '../useCases/paggueio-ipn/paggueio.ipn.dto';
import { StarpayIpnCase } from '@/app/ipn/useCases/starpay-ipn/starpay.ipn.case';
import { CieloIpnCase } from '../useCases/cielo-ipn/cielo.ipn.case';
import { FirebankingIpnCase } from '../useCases/firebanking-ipn/firebanking.ipn.case';
import { FirebankingDTO } from '../useCases/firebanking-ipn/firebanking.ipn.dto';

@Injectable()
export class IpnService {
  constructor(
    private readonly safe2PayIpnCase: Safe2PayIpnCase,
    private readonly interpjIpnCase: InterpjIpnCase,
    private readonly mercadopagoIpnCase: MercadoPagoIpnCase,
    private readonly pagstarIpnCase: PagstarIpnCase,
    private readonly openpixIpnCase: OpenPixIpnCase,
    private readonly suitpayIpnCase: SuitpayIpnCase,
    private readonly saqPayIpnCase: SaqPayIpnCase,
    private readonly paggueioIpnCase: PaggueioIpnCase,
    private readonly starPayIpnCase: StarpayIpnCase,
    private readonly cieloIpnCase: CieloIpnCase,
    private readonly firebankingIpnCase: FirebankingIpnCase,
  ) {}

  async safe2payIpn(data: ISafe2PayIpn) {
    return await this.safe2PayIpnCase.execute(data);
  }

  async interpjIpn(data: InterPJIpn) {
    return await this.interpjIpnCase.execute(data);
  }

  async mercadopagoIpn(data: { topic: string; id: string }) {
    return await this.mercadopagoIpnCase.execute(data);
  }

  async suitpayIpn(data: {
    idTransaction: string;
    statusTransaction: string;
    typeTransaction: string;
  }) {
    return await this.suitpayIpnCase.execute(data);
  }

  async pagstarIpn(data: {
    external_reference: string;
    transaction_id: string;
  }) {
    return await this.pagstarIpnCase.execute(data);
  }

  async openPixIpn(data: OpenPixIpnDTO) {
    return await this.openpixIpnCase.execute(data);
  }

  async saqPayIpn(data: {
    transaction_id: string;
    partner_conciliation_id: string;
    transaction_amount: number;
    ipn_secret: string;
    transaction_status: string;
    payment_date: string;
  }) {
    return await this.saqPayIpnCase.execute(data);
  }

  async paggueioIpn(data: PaggueioDTO) {
    return await this.paggueioIpnCase.execute(data);
  }

  async starPayIpn(data: {
    idTransaction: string;
    statusTransaction: string;
    typeTransaction: string;
    ipn_secret: string;
  }) {
    return await this.starPayIpnCase.execute(data);
  }

  async cieloIpn(data: { PaymentId: string }) {
    return await this.cieloIpnCase.execute(data);
  }

  async firebankingIpn(data: FirebankingDTO) {
    return await this.firebankingIpnCase.execute(data);
  }
}
