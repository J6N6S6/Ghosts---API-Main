import { Injectable } from '@nestjs/common';
import { AuthUserCase } from '../useCases/auth-user/auth_user.case';
import { AuthUserDTO } from '../useCases/auth-user/auth_user.dto';
import { ChangePasswordTokenCase } from '../useCases/change-password-token/change_password_token.case';
import { ChangePasswordTokenDTO } from '../useCases/change-password-token/change_password_token.dto';
import { ChangePasswordCase } from '../useCases/change-password/change_password.case';
import { ChangePasswordDTO } from '../useCases/change-password/change_password.dto';
import { CreateUserCase } from '../useCases/create-user/create_user.case';
import { CreateUserDTO } from '../useCases/create-user/create_user.dto';
import { GetUserDataCase } from '../useCases/get-user-data/get_user_data.case';
import { PreCreateUserCase } from '../useCases/pre-create-user/pre_create_user.case';
import { PreCreateUserDTO } from '../useCases/pre-create-user/pre_create_user.dto';
import { RefreshTokenCase } from '../useCases/refresh-token/refresh_token.case';
import { RefreshTokenDTO } from '../useCases/refresh-token/refresh_token.dto';
import { RequestResetPasswordCase } from '../useCases/request-reset-password/request_reset_password.case';
import { RequestResetPasswordDTO } from '../useCases/request-reset-password/request_reset_password.dto';
import { ResendEmailHashCase } from '../useCases/resend-email-hash/resend_email_hash.case';
import { ResetPasswordCase } from '../useCases/reset-password/reset_password.case';
import { ResetPasswordDTO } from '../useCases/reset-password/reset_password.dto';
import { ValidateEmailAndPasswordCase } from '../useCases/validate-email-and-password/validate-email-and-password.case';
import { ValidateEmailHashCase } from '../useCases/validate-email-hash/validate_email_hash.case';
import { ValidateEmailHashDTO } from '../useCases/validate-email-hash/validate_email_hash.dto';
import { ValidateTokenCase } from '../useCases/validate-token/validate_token.case';
import { ValidateMFACodeCase } from '../useCases/validate-mfa-code/validate_mfa_code.case';
import { ValidateMFACodeDTO } from '../useCases/validate-mfa-code/validate_mfa_code.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly createUserCase: CreateUserCase,
    private readonly getUserDataCase: GetUserDataCase,
    private readonly authUserCase: AuthUserCase,
    private readonly validateMFACodeCase: ValidateMFACodeCase,

    private readonly validateTokenCase: ValidateTokenCase,
    private readonly validateEmailAndPasswordCase: ValidateEmailAndPasswordCase,
    private readonly refreshTokenCase: RefreshTokenCase,
    private readonly changePasswordCase: ChangePasswordCase,
    private readonly requestResetPasswordCase: RequestResetPasswordCase,
    private readonly resetPasswordCase: ResetPasswordCase,
    private readonly changePasswordTokenCase: ChangePasswordTokenCase,
    private readonly validateEmailHashCase: ValidateEmailHashCase,
    private readonly resendEmailHashCase: ResendEmailHashCase,
    private readonly preCreateUserCase: PreCreateUserCase,
  ) {}

  async getUserData(user_id: string) {
    return this.getUserDataCase.execute(user_id);
  }

  async validateToken(user_id: string, token: string) {
    return this.validateTokenCase.execute(user_id, token);
  }

  async createUser(data: CreateUserDTO) {
    return this.createUserCase.execute(data);
  }

  async authUser(data: AuthUserDTO) {
    return this.authUserCase.execute(data);
  }

  async validateMFACode(data: ValidateMFACodeDTO) {
    return this.validateMFACodeCase.execute(data);
  }

  async validateEmailAndPassword(email: string, password: string) {
    return this.validateEmailAndPasswordCase.execute(email, password);
  }

  async refreshToken(data: RefreshTokenDTO) {
    return this.refreshTokenCase.execute(data);
  }

  async changePassword(data: ChangePasswordDTO) {
    return this.changePasswordCase.execute(data);
  }

  async requestResetPassword(data: RequestResetPasswordDTO) {
    return this.requestResetPasswordCase.execute(data);
  }

  async resetPassword(data: ResetPasswordDTO) {
    return this.resetPasswordCase.execute(data);
  }

  async changePasswordToken(data: ChangePasswordTokenDTO) {
    return this.changePasswordTokenCase.execute(data);
  }

  async validateEmailHash(data: ValidateEmailHashDTO) {
    return this.validateEmailHashCase.execute(data);
  }

  async resendEmailHash(email: string) {
    return this.resendEmailHashCase.execute({ email });
  }

  async preCreateUser(data: PreCreateUserDTO) {
    return this.preCreateUserCase.execute(data);
  }

  async isInBlackList(ip_adress: string) {
    return false;
  }
}
