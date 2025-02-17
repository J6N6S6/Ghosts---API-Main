import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository, UsersRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateAuthTokenCase } from '../create-auth-token/create_auth_token.case';
import { AuthUserDTO } from './auth_user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly createAuthTokenCase: CreateAuthTokenCase,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    email,
    password,
    ip_address,
    user_agent,
    session_origin,
  }: AuthUserDTO) {
    const user = await this.usersRepository.findByEmail(email);
    email = email.toLowerCase();

    if (!user) {
      throw new ClientException('Email ou senha incorretos!');
    }

    if (!user.email_validated) {
      throw new ClientException('Email não validado');
    }

    if (!user.password) {
      throw new ClientException(
        'Para logar, você precisa recuperar a sua senha',
      );
    }

    if (user.login_attempts >= 10) {
      if (
        user.last_login_attempt <
        new Date(new Date().getTime() - 30 * 60 * 1000)
      ) {
        await this.usersRepository.update(
          new User({
            ...user,
            login_attempts: 0,
            last_login_attempt: new Date(),
          }),
        );
      } else {
        throw new ClientException('Limite de tentativas excedido');
      }
    }

    const requestDate = new Date();
    requestDate.setHours(requestDate.getHours() - 3);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          ip_address,
          activity_type: 'FAILED_SIGN_IN',
          metadata: {
            request_At: requestDate,
            user_agent,
            session_origin,
          },
        }),
      );

      await this.usersRepository.update(
        new User({
          ...user,
          login_attempts: user.login_attempts + 1,
          last_login_attempt: new Date(),
        }),
      );

      throw new ClientException('Email ou senha incorretos!');
    }

    if (user.account_type === 'ADMIN' || user.account_type === 'ASSISTENT') {
      const code = Math.floor(100000 + Math.random() * 900000);

      const userModel = new User({
        ...user,
        mfa_code: code.toString(),
        mfa_code_expires: new Date(new Date().getTime() + 600000),
      });
      this.usersRepository.update(userModel);

      this.eventEmitter.emit('mailer.send', {
        template: 'ADMIN_MFA',
        template_type: null,
        to: {
          name: user.name,
          address: user.email,
        },
        template_data: {
          code_1: userModel.mfa_code[0],
          code_2: userModel.mfa_code[1],
          code_3: userModel.mfa_code[2],
          code_4: userModel.mfa_code[3],
          code_5: userModel.mfa_code[4],
          code_6: userModel.mfa_code[5],
        },
        subject: `Código de autenticação de dois fatores`,
        templateId: 'd-7d4d5e8694634b5284cc520843589935',
      });

      await this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          ip_address,
          activity_type: 'REQUEST_MFA_CODE',
          metadata: {
            request_At: requestDate,
            user_agent,
            session_origin,
          },
        }),
      );

      return { message: 'Código MFA enviado por email', hasMFA: true };
    }

    await this.usersRepository.update(
      new User({
        ...user,
        login_attempts: 0,
        last_login_attempt: new Date(),
      }),
    );

    const authLogin = await this.createAuthTokenCase.execute({
      user_id: user.id,
      ip_address,
      user_agent,
      session_origin,
    });

    return authLogin;
  }
}
