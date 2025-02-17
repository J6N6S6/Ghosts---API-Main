import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { IntegrationsService } from './services/integrations.service';

import { AuthModule } from '../auth/auth.module';
import { IpnModule } from '../ipn/ipn.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { IntegrationsController } from './controllers/integrations.controller';
import { GetIntegrationsCase } from './useCases/get-integrations/get_integrations.case';
import { UpdatePushCutCredentialsCase } from './providers/push-cut/useCase/update-push-cut-credentials/update_push_cut_credentials.case';
import { PushCutService } from './providers/push-cut/pushcut.service';
import { UtmfyModule } from './providers/utmfy/utmfy.module';
import { PushCutModule } from './providers/push-cut/push_cut.module';
import { SendPushCutWebHookCase } from './providers/push-cut/useCase/send-push-cut-webhook/update_push_cut_credentials.case';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: '',
        };
      },
    }),
    InfraModule,
    IpnModule,
    AuthModule,
    UtmfyModule,
    PushCutModule,
  ],
  providers: [
    IntegrationsService,
    GetIntegrationsCase,
    UpdatePushCutCredentialsCase,
    PushCutService,
    SendPushCutWebHookCase,
  ],
  controllers: [IntegrationsController],
  exports: [
    IntegrationsService,
    UpdatePushCutCredentialsCase, // Exporte isto também
  ],
})
export class IntegrationsModule {}
