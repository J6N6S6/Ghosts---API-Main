import { UserNotificationsPreferencesRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { SendGridClient } from '../clients/sendgrid.client';
import { MailDataRequired } from '@sendgrid/mail';

interface ISendMail {
  to: {
    name?: string;
    address: string;
  };
  from?: {
    name?: string;
    address: string;
  };
  template: string;
  template_data: any;
  template_type?: string | null;
  templateId?: string;
  subject?: string;
}

@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userNotificationsPreferencesRepository: UserNotificationsPreferencesRepository,
    private readonly sendGridClient: SendGridClient,
  ) {}

  @OnEvent('mailer.send')
  async sendMail({
    to,
    from,
    template,
    template_data,
    templateId,
    template_type = null,
    subject,
  }: ISendMail) {
    console.log('Template:', template);

    if (!templateId) {
      return console.log('Mail Template ID not found on: ', template);
    }

    if (template_type !== null) {
      const hasActiveNotification =
        await this.userNotificationsPreferencesRepository.findByUserEmail(
          to.address,
        );

      if (
        hasActiveNotification &&
        hasActiveNotification[template_type] === false
      )
        return null;
    }

    const default_address = this.configService.get('mailer.default_address');

    const mail: MailDataRequired = {
      to: to.address,

      from: default_address, //Approved sender ID in Sendgrid
      templateId: templateId, //Retrieve from config service or environment variable
      personalizations: [
        {
          to: { email: to.address },
          dynamicTemplateData: {
            ...template_data,
            subject: `projectx | ${subject}`,
          },
        },
      ], //The data to be used in the template
    };

    await this.sendGridClient.send(mail);
  }
}
