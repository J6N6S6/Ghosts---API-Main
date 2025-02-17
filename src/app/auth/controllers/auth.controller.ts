import { HttpResponse } from '@/shared/@types/HttpResponse';
import { Body, Controller, Headers, Ip, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsPublic } from '../decorators/endpoint-public.decorator';
import { AuthService } from '../services/auth.service';
import { AuthLoginBody } from '../validators/auth_login.body';
import { AuthRegisterBody } from '../validators/auth_register.body';
import { RecoveryPasswordBody } from '../validators/recovery_password.body';
import { RefreshTokenBody } from '../validators/refresh_token.body';
import { ResendEmailHashBody } from '../validators/resend_email_hash.body';
import { ResetPasswordBody } from '../validators/reset_password.body';
import { ResetPasswordValidateBody } from '../validators/reset_password_validate.body';
import { ValidateEmailHashBody } from '../validators/validate_email_hash.body';
import { Request } from 'express';
import { ValidateMFACodeBody } from '../validators/validate_mfa_code.body';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  async login(
    @Body() data: AuthLoginBody,
    @Ip() ip_address: string,
    @Headers('user-agent') user_agent: string,
    @Req() request: Request,
  ): Promise<HttpResponse> {
    const clientIp =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    const auth_data = await this.authService.authUser({
      ...data,
      ip_address: JSON.stringify(clientIp),
      user_agent,
      session_origin: data.session_origin || 'web',
    });

    return {
      hasError: false,
      data: auth_data,
    };
  }

  @IsPublic()
  @Post('login/mfa')
  async loginMfaCode(
    @Body() data: ValidateMFACodeBody,
    @Headers('user-agent') user_agent: string,
    @Req() request: Request,
  ): Promise<HttpResponse> {
    const clientIp =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    const auth_data = await this.authService.validateMFACode({
      ...data,
      ip_address: JSON.stringify(clientIp),
      user_agent,
      session_origin: data.session_origin || 'web',
    });

    return {
      hasError: false,
      data: auth_data,
    };
  }

  @IsPublic()
  @Post('login/refresh')
  async refreshSession(
    @Body() data: RefreshTokenBody,
    @Req() req: Request,
    @Headers('user-agent') user_agent: string,
  ): Promise<HttpResponse> {
    const ip_address =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const auth_data = await this.authService.refreshToken({
      ...data,
      ip_address: ip_address as string,
      user_agent,
      session_origin: 'web',
    });

    return {
      hasError: false,
      data: auth_data,
    };
  }

  @IsPublic()
  @Post('register')
  async register(
    @Body() data: AuthRegisterBody,
    // @Headers('sunize-v2-bypass') bypass: string,
  ): Promise<HttpResponse> {
    // if (bypass !== 'bypass-allowed')
    //   throw new ClientException(
    //     'Estamos em manutenção, tente novamente mais tarde.',
    //   );

    await this.authService.createUser(data);

    return {
      hasError: false,
      message: 'Usuário criado com sucesso, faça login para continuar.',
    };
  }

  @IsPublic()
  @Post('forgot-password')
  async forgotPassword(
    @Body() data: RecoveryPasswordBody,
    @Ip() ip_address: string,
  ): Promise<HttpResponse> {
    await this.authService.requestResetPassword({
      email: data.email,
      ip_address,
    });

    return {
      hasError: false,
      message: 'Email enviado com sucesso.',
    };
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(
    @Body() data: ResetPasswordBody,
    @Ip() ip_address: string,
  ): Promise<HttpResponse> {
    const tokenData = await this.authService.resetPassword({
      email: data.email,
      code: data.code,
      ip_address,
    });

    return {
      hasError: false,
      data: tokenData,
    };
  }

  @IsPublic()
  @Post('reset-password/validate')
  async validateToken(
    @Body() data: ResetPasswordValidateBody,
    @Ip() ip_address: string,
    @Headers('user-agent') user_agent: string,
  ): Promise<HttpResponse> {
    await this.authService.changePasswordToken({
      email: data.email,
      token: data.token,
      password: data.password,
      ip_address,
      user_agent,
      session_origin: data.session_origin || 'web',
    });

    return {
      hasError: false,
      message: 'Senha alterada com sucesso.',
    };
  }

  @IsPublic()
  @Post('validate-email')
  async validateEmail(
    @Body() data: ValidateEmailHashBody,
    @Ip() ip_address: string,
    @Headers('user-agent') user_agent: string,
  ): Promise<HttpResponse> {
    const auth_data = await this.authService.validateEmailHash({
      ...data,
      ip_address,
      user_agent,
      session_origin: 'web',
    });

    return {
      hasError: false,
      data: auth_data,
    };
  }

  @IsPublic()
  @Post('validate-email/resend')
  @Throttle(1, 60)
  async resendEmailValidation(
    @Body() data: ResendEmailHashBody,
  ): Promise<HttpResponse> {
    await this.authService.resendEmailHash(data.email);

    return {
      hasError: false,
      message: 'Email enviado com sucesso.',
    };
  }
}
