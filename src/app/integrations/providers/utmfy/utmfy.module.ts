import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { IpnModule } from '@/app/ipn/ipn.module';
import { AuthModule } from '@/app/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntegrationsService } from '../../services/integrations.service';
import { GetIntegrationsCase } from '../../useCases/get-integrations/get_integrations.case';
import { UtmfyService } from './utmfy.service';
import { IntegrationsModule } from '../../integrations.module';
import { UpdateUtmfyCredentialsCase } from './useCases/update-credentials/update_credentials.case';
import { UtmfyController } from './controllers/utmfy.controller';
import { CreateUtmfyOrderCase } from './useCases/create-order/create-order.case';

@Module({
  imports: [
    InfraModule,
    IpnModule,
    AuthModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: '',
        };
      },
    }),
  ],
  providers: [
    GetIntegrationsCase,
    UtmfyService,
    UpdateUtmfyCredentialsCase,
    CreateUtmfyOrderCase,
  ],
  controllers: [UtmfyController],
  exports: [UtmfyService],
})
export class UtmfyModule {}
