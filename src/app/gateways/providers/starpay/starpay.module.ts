import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StarpayService } from './starpay.service';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CreatePixPaymentCase, StarpayService],
  exports: [StarpayService],
})
export class StarpayModule {}
