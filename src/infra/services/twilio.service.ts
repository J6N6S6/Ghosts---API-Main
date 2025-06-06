// src/infra/services/twilio.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    this.logger.log(
      '[TwilioService] Modo MOCK ativo — nenhum SMS ou verificação será executada',
    );
  }

  // antigo sendSms stub
  async sendSms(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendSms] to=${to} body="${body}"`);
    return Promise.resolve();
  }

  // se você usa WhatsApp
  async sendWhatsApp(to: string, body: string): Promise<void> {
    this.logger.debug(`[MOCK sendWhatsApp] to=${to} body="${body}"`);
    return Promise.resolve();
  }

  // --- NOVOS STUBS para build passar ---
  /**
   * Inicia verificação de telefone (sendVerifyCode)
   */
  async sendVerifyCode(
    phone: string,
    channel: 'sms' | 'call',
  ): Promise<{ sid: string }> {
    this.logger.debug(
      `[MOCK sendVerifyCode] phone=${phone} channel=${channel}`,
    );
    // retorna um objeto compatível com o original (apenas SID fake)
    return Promise.resolve({ sid: 'MOCK-SID-1234' });
  }

  /**
   * Checa código de verificação (checkVerifyCode)
   */
  async checkVerifyCode(
    phone: string,
    code: string,
  ): Promise<{ status: 'approved' | 'pending' }> {
    this.logger.debug(`[MOCK checkVerifyCode] phone=${phone} code=${code}`);
    // simula sempre aprovado para evitar lógica de erro
    return Promise.resolve({ status: 'approved' });
  }
}
