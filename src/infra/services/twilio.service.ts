import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TwilioSDK from 'twilio';

@Injectable()
export class TwilioService {
  private client: TwilioSDK.Twilio;
  private verifySid: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');

    this.verifySid = this.configService.get<string>('twilio.verifyServiceSid');
    this.client = TwilioSDK(accountSid, authToken);
  }

  async sendVerifyCode(to: string, channel: 'sms' | 'whatsapp') {
    try {
      const msg = await this.client.verify.v2
        .services(this.verifySid)
        .verifications.create({
          to,
          channel,
        });

      return {
        status: msg.status,
        to: msg.to,
        channel: msg.channel,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        to,
        channel,
      };
    }
  }

  async checkVerifyCode(to: string, code: string) {
    try {
      const verify = await this.client.verify.v2
        .services(this.verifySid)
        .verificationChecks.create({
          to,
          code,
        });

      return {
        status: verify.status,
        to: verify.to,
        verified: verify.valid,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        to,
        verified: false,
      };
    }
  }
}
