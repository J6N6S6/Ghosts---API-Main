import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';
import { SendGridClient } from './clients/sendgrid.client';

@Module({
  imports: [InfraModule, ConfigModule],
  providers: [MailerService, SendGridClient],
  exports: [MailerService],
})
export class MailerModule {}
