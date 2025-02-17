import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenPixService } from './openpix.service';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isSandbox = configService.get<string>('openpix.is_sandbox');

        return {
          baseURL: isSandbox
            ? 'https://api.openpix.com.br/api/v1'
            : 'https://api.openpix.com.br/api/v1',
          headers: {
            'content-type': 'application/json',
            Authorization: configService.get<string>('openpix.app_id'),
          },
        };
      },
    }),
  ],
  providers: [CreatePixPaymentCase, OpenPixService],
  exports: [OpenPixService],
})
export class OpenPixModule {}
