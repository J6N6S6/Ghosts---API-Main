import { Injectable } from '@nestjs/common';
import { ChangeAdquirentDTO } from '../../dtos/ChangeAdquirentDTO';
import { PlataformSettingsRepository } from '@/domain/repositories';
import { PlataformSetting } from '@/domain/models/plataform_settings.model';

@Injectable()
export class ChangeAdquirentCase {
  constructor(
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
  ) {}

  async execute(data: ChangeAdquirentDTO) {
    if (data.payment_method === 'PIX') {
      const currentSetting = await this.plataformSettingsRepository.findByKey(
        'GATEWAY_PIX',
      );
      currentSetting.value = data.adquirent;
      const updatedSetting = new PlataformSetting(currentSetting);

      await this.plataformSettingsRepository.update(updatedSetting);
    }

    if (data.payment_method === 'BANK_SLIP') {
      const currentSetting = await this.plataformSettingsRepository.findByKey(
        'GATEWAY_BANK_SLIP',
      );
      currentSetting.value = data.adquirent;
      const updatedSetting = new PlataformSetting(currentSetting);

      await this.plataformSettingsRepository.update(updatedSetting);
    }

    if (data.payment_method === 'CREDIT_CARD') {
      const currentSetting = await this.plataformSettingsRepository.findByKey(
        'GATEWAY_CREDIT_CARD',
      );
      currentSetting.value = data.adquirent;
      const updatedSetting = new PlataformSetting(currentSetting);

      await this.plataformSettingsRepository.update(updatedSetting);
    }

    return `Success changing adquirent for ${data.payment_method}`;
  }
}
