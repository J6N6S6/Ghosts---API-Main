import { PlataformSetting } from './../../../../domain/models/plataform_settings.model';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCurrentAdquirentsCase {
  constructor(
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
  ) {}

  async execute() {
    const plataformSettings = await this.plataformSettingsRepository.findAll();

    if (!plataformSettings)
      throw new ClientException('platform settings not found', 500);

    let pixAdquirent = null;
    let creditCardAdquirent = null;
    let bankSlipAdquirent = null;

    const paymentMethods = plataformSettings.map((item) => {
      if (item.key === 'GATEWAY_PIX') {
        pixAdquirent = item.value;
      }
      if (item.key === 'GATEWAY_CREDIT_CARD') {
        creditCardAdquirent = item.value;
      }
      if (item.key === 'GATEWAY_BANK_SLIP') {
        bankSlipAdquirent = item.value;
      }

      return item;
    });

    return {
      PIX: pixAdquirent,
      CREDIT_CARD: creditCardAdquirent,
      BANK_SLIP: bankSlipAdquirent,
    };
  }
}
