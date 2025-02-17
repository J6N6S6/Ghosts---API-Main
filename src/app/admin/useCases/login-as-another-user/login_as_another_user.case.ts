import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/repositories';

import { LoginAsAnotherUserDTO } from './login_as_another_user.dtos';
import { CreateAuthTokenCase } from '@/app/auth/useCases/create-auth-token/create_auth_token.case';
import { Client } from 'twilio/lib/base/BaseTwilio';
import { ClientException } from '@/infra/exception/client.exception';
import { refreshToken } from 'firebase-admin/app';

@Injectable()
export class LoginAsAnotherUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,

    private readonly createAuthTokenCase: CreateAuthTokenCase,
  ) {}

  async execute({
    user_id,
    ip_address,
    user_agent,
    login_by_user_id,
  }: LoginAsAnotherUserDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ClientException('Usuário não encontrado');
    }

    if (user_id === login_by_user_id) {
      throw new ClientException(
        'Você não pode fazer login na sua própria conta',
      );
    }

    if (user.account_type === 'ADMIN' || user.account_type === 'ASSISTENT') {
      throw new ClientException(
        'Você não pode fazer login na conta de um administrador',
      );
    }

    const data = await this.createAuthTokenCase.execute({
      user_agent,
      ip_address,
      session_origin: 'admin-web',
      user_id,
      is_login_as_another_user: true,
      metadata: {
        login_by_user_id,
        login_at: new Date(),
      },
    });

    return {
      access_token: data.token,
      refresh_token: data.refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
