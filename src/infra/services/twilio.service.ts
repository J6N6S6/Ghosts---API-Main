// src/infra/services/twilio.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    this.logger.log(
      '[TwilioService] Modo MOCK ativo — nenhum SMS será enviado'
    );
  }

  /**
   * Envia SMS — agora apenas um stub.
   * @param to número de destino
   * @param body texto da mensagem
   */
  async sendSms(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendSms] to=${to} body="${body}"`);
    return Promise.resolve();
  }

  /**
   * Se você tiver outros métodos (e.g. sendWhatsApp),
   * transforme-os da mesma forma:
   */
  async sendWhatsApp(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendWhatsApp] to=${to} body="${body}"`);
    return Promise.resolve();
  }
}
