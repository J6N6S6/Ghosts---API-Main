import { InfraModule } from '@/infra/infra.module';
import { OwnershipGuard } from '@/shared/guards/OwnershipGuard';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from '../products/products.module';
import { AuthController } from './controllers/auth.controller';
import { UserAuthController } from './controllers/user_auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthUserCase } from './useCases/auth-user/auth_user.case';
import { ChangePasswordTokenCase } from './useCases/change-password-token/change_password_token.case';
import { ChangePasswordCase } from './useCases/change-password/change_password.case';
import { CreateAuthTokenCase } from './useCases/create-auth-token/create_auth_token.case';
import { CreateUserCase } from './useCases/create-user/create_user.case';
import { GetUserDataCase } from './useCases/get-user-data/get_user_data.case';
import { PreCreateUserCase } from './useCases/pre-create-user/pre_create_user.case';
import { RefreshTokenCase } from './useCases/refresh-token/refresh_token.case';
import { RequestResetPasswordCase } from './useCases/request-reset-password/request_reset_password.case';
import { ResendEmailHashCase } from './useCases/resend-email-hash/resend_email_hash.case';
import { ResetPasswordCase } from './useCases/reset-password/reset_password.case';
import { ValidateEmailAndPasswordCase } from './useCases/validate-email-and-password/validate-email-and-password.case';
import { ValidateEmailHashCase } from './useCases/validate-email-hash/validate_email_hash.case';
import { ValidateTokenCase } from './useCases/validate-token/validate_token.case';
import { AddInviteCodeCase } from './useCases/add-invite-code/add_invite_code.case';
import { ValidateMFACodeCase } from './useCases/validate-mfa-code/validate_mfa_code.case';

@Module({
  imports: [InfraModule, HttpModule, ProductsModule],
  providers: [
    GetUserDataCase,
    RefreshTokenCase,
    AuthService,
    CreateUserCase,
    ValidateTokenCase,
    ChangePasswordCase,
    RequestResetPasswordCase,
    AuthUserCase,
    CreateAuthTokenCase,
    ValidateEmailAndPasswordCase,
    ResetPasswordCase,
    ValidateEmailHashCase,
    ChangePasswordTokenCase,
    ResendEmailHashCase,
    PreCreateUserCase,
    JwtStrategy,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OwnershipGuard,
    },
    AddInviteCodeCase,
    ValidateMFACodeCase,
  ],
  controllers: [AuthController, UserAuthController],
  exports: [AuthService],
})
export class AuthModule {}
