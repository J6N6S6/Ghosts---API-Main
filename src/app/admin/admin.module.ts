import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';

import { AuthModule } from '../auth/auth.module';
import { IpnModule } from '../ipn/ipn.module';

import { AdminService } from './services/admin.service';
import { GetCurrentAdquirentsCase } from './useCases/get-current-adquirents/get_current_adquirents.case';
import { GetAvailablesAdquirentsCase } from './useCases/get-availables-adquirents/get_availables_adquirents.case';
import { ChangeAdquirentCase } from './useCases/change-adquirent/change_adquirent.case';
import { CreateTaxeCase } from './useCases/create-taxe/create-taxe.case';
import { UpdateTaxeCase } from './useCases/update-taxe/update-taxe.case';
import { GetTaxesCase } from './useCases/get-taxes/get-taxes.case';
import { GetUsersCase } from './useCases/get-users/get-users.case';
import { UpdateUserTaxeCase } from './useCases/update-user-taxe/update-user-taxe.case';
import { GetTaxeCase } from './useCases/get-taxe/get-taxe.case';
import { GetAccountBalanceCase } from '../banking/useCases/get-account-balance/get_account_balance.case';
import { SettleUserReservedBalance } from '../banking/useCases/settle-user-reserved-balance/settle-user-reserved-balance.case';
import { GetUserBalanceCase } from './useCases/get-user-balance/get-user-banalance.case';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GetUserMetricsCase } from './useCases/get-user-metrics/get-user-metrics.case';
import { LoginAsAnotherUserCase } from './useCases/login-as-another-user/login_as_another_user.case';
import { CreateAuthTokenCase } from '../auth/useCases/create-auth-token/create_auth_token.case';
import { ToggleUserStatusCase } from './useCases/toggle-user-status/toggle_user_status.case';

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
          baseURL: 'https://api.projectxpayment.com',
          // baseURL: 'http://localhost:3001',
        };
      },
    }),
  ],
  providers: [
    AdminService,
    GetCurrentAdquirentsCase,
    GetAvailablesAdquirentsCase,
    ChangeAdquirentCase,
    CreateTaxeCase,
    UpdateTaxeCase,
    GetTaxesCase,
    GetUsersCase,
    UpdateUserTaxeCase,
    GetTaxeCase,
    GetUserBalanceCase,
    GetUserMetricsCase,
    LoginAsAnotherUserCase,
    CreateAuthTokenCase,
    ToggleUserStatusCase,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
