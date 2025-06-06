import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    this.logger.log(
      '[TwilioService] Modo MOCK ativo — nenhum SMS ou verificação será executada',
    );
  }

  /** Envia SMS — stub */
  async sendSms(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendSms] to=${to} body="${body}"`);
    return Promise.resolve();
  }

  /** Envia WhatsApp — stub */
  async sendWhatsApp(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendWhatsApp] to=${to} body="${body}"`);
    return Promise.resolve();
  }

  /**
   * Inicia verificação de telefone
   * @param channel agora aceita 'sms' ou 'whatsapp' conforme seu código
   * @returns sid + status
   */
  async sendVerifyCode(
    phone: string,
    channel: 'sms' | 'whatsapp',
  ): Promise<{ sid: string; status: 'pending' }> {
    this.logger.debug(
      `[MOCK sendVerifyCode] phone=${phone} channel=${channel}`,
    );
    return Promise.resolve({ sid: 'MOCK-SID-1234', status: 'pending' });
  }

  /**
   * Checa código de verificação
   * @returns status + verified boolean para seu if (!verified)
   */
  async checkVerifyCode(
    phone: string,
    code: string,
  ): Promise<{ status: 'approved' | 'pending'; verified: boolean }> {
    this.logger.debug(`[MOCK checkVerifyCode] phone=${phone} code=${code}`);
    return Promise.resolve({ status: 'approved', verified: true });
  }
}
