import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
const sendGrid = require('@sendgrid/mail');

@Injectable()
export class SendGridClient {
  constructor(private readonly configService: ConfigService) {
    sendGrid.setApiKey(this.configService.get<string>('sendgrid.api_key'));
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await sendGrid.send(mail);
    } catch (error) {
      console.log('error ao enviar email: ', mail);
      throw error;
    }
  }
}
