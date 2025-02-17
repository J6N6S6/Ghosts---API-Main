import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { PlataformSetting } from '@/domain/models/plataform_settings.model';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PlataformSettingsSeed implements OnModuleInit {
  constructor(
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const settings = await this.plataformSettingsRepository.findAll();
    if (settings.length >= 1) return;

    const settingsToCreate = [
      {
        key: 'GATEWAY_PIX',
        value: GatewayProvider.MERCADO_PAGO,
        description: 'Gateway de pagamento PIX',
      },
      {
        key: 'GATEWAY_CREDIT_CARD',
        value: GatewayProvider.MERCADO_PAGO,
        description: 'Gateway de pagamento cartão de crédito',
      },
      {
        key: 'GATEWAY_BANK_SLIP',
        value: GatewayProvider.MERCADO_PAGO,
        description: 'Gateway de pagamento boleto bancário',
      },
    ];

    await Promise.all(
      settingsToCreate.map((setting) =>
        this.plataformSettingsRepository.create(new PlataformSetting(setting)),
      ),
    );
  }
}
