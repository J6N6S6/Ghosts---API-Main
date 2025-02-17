import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { IpnModule } from '@/app/ipn/ipn.module';
import { AuthModule } from '@/app/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntegrationsService } from '../../services/integrations.service';
import { GetIntegrationsCase } from '../../useCases/get-integrations/get_integrations.case';
import { PushCutService } from './pushcut.service';
import { UpdatePushCutCredentialsCase } from './useCase/update-push-cut-credentials/update_push_cut_credentials.case';
import { SendPushCutWebHookCase } from './useCase/send-push-cut-webhook/update_push_cut_credentials.case';
import { PushCutController } from './controllers/push_cut.controller';

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
    PushCutService,
    UpdatePushCutCredentialsCase,
    SendPushCutWebHookCase,
  ],
  controllers: [PushCutController],
  exports: [],
})
export class PushCutModule {}
