import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository, UsersRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { CreateAuthTokenCase } from '../create-auth-token/create_auth_token.case';
import { ValidateEmailHashDTO } from './validate_email_hash.dto';

@Injectable()
export class ValidateEmailHashCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly createAuthTokenCase: CreateAuthTokenCase,
  ) {}

  async execute({
    email,
    hash,
    ip_address,
    session_origin,
    user_agent,
  }: ValidateEmailHashDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ClientException('Usuário não encontrado');
    if (user.email_validated) throw new ClientException('Email já validado');
    if (user.email_hash !== hash) throw new ClientException('Hash inválido');

    const userModel = new User(user);

    userModel.email_validated = true;
    userModel.email_hash = null;

    await Promise.all([
      this.usersRepository.update(userModel),
      this.userActivityRepository.create(
        new UserActivity({
          activity_type: 'EMAIL_VALIDATED',
          ip_address,
          user_id: user.id,
        }),
      ),
    ]);

    const loginUser = await this.createAuthTokenCase.execute({
      user_id: user.id,
      ip_address,
      user_agent,
      session_origin,
    });

    return loginUser;
  }
}
