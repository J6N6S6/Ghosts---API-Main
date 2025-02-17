import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository, UsersRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateAuthTokenCase } from '../create-auth-token/create_auth_token.case';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidateMFACodeDTO } from './validate_mfa_code.dto';

@Injectable()
export class ValidateMFACodeCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly createAuthTokenCase: CreateAuthTokenCase,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    email,
    code,
    ip_address,
    user_agent,
    session_origin,
  }: ValidateMFACodeDTO) {
    const user = await this.usersRepository.findByEmail(email);
    email = email.toLowerCase();

    if (!user) {
      throw new ClientException('Email ou senha incorretos!');
    }

    if (!user.mfa_code) {
      throw new ClientException(
        'Você não solicitou autenticação em dois fatores!',
      );
    }
    const now = new Date();
    if (now > user.mfa_code_expires) {
      throw new ClientException('Código de autenticação expirado!');
    }

    if (user.mfa_code !== String(code)) {
      await this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          ip_address,
          activity_type: 'FAILED_SIGN_IN_WRONG_MFA',
        }),
      );
      throw new ClientException('Código de autenticação inválido!');
    }

    const authLogin = await this.createAuthTokenCase.execute({
      user_id: user.id,
      ip_address,
      user_agent,
      session_origin,
    });

    const userModel = new User({
      ...user,
      mfa_code: null,
      mfa_code_expires: null,
    });

    await this.usersRepository.update(userModel);

    return authLogin;
  }
}
