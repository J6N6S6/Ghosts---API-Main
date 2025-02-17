import { ClientException } from '@/infra/exception/client.exception';
import { UserActivity } from '@/domain/models/user_activity.model';
import { UserOldPassword } from '@/domain/models/user_old_password.model';
import { User } from '@/domain/models/users.model';
import {
  UserActivityRepository,
  UserOldPasswordsRepository,
  UserSessionsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordTokenDTO } from './change_password_token.dto';
import { CreateAuthTokenCase } from '../create-auth-token/create_auth_token.case';

@Injectable()
export class ChangePasswordTokenCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly usersOldPassowrdRepository: UserOldPasswordsRepository,
    private readonly createAuthTokenCase: CreateAuthTokenCase,
  ) {}

  async execute({
    ip_address,
    email,
    token,
    password,
    user_agent,
    session_origin,
  }: ChangePasswordTokenDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ClientException('Usuário não encontrado');

    if (!user.reset_password_token)
      throw new ClientException('Você não solicitou a recuperação de senha');

    if (user.reset_password_token !== token)
      throw new ClientException(
        'Alguma coisa deu errado ao tentar resetar a senha',
      );

    const now = new Date();

    if (now > user.reset_password_token_expires)
      throw new ClientException('Token expirado');

    const oldPassword = await this.usersOldPassowrdRepository.find({
      where: {
        user_id: user.id,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });

    const oldPasswords = oldPassword.map((password) => password.password);

    const oldPasswordMatch = oldPasswords.find((hash) =>
      bcrypt.compareSync(password, hash),
    );

    if (oldPasswordMatch)
      throw new ClientException(
        'Essa senha já foi utilizada antes, tente novamente com uma outra senha!',
      );

    const userModel = new User(user);

    const hashedPassword = await bcrypt.hash(password, 12);

    userModel.reset_password_code = null;
    userModel.reset_password_expires = null;
    userModel.reset_password_attempts = 0;
    userModel.reset_password_token = null;
    userModel.reset_password_token_expires = null;
    userModel.password = hashedPassword;

    await Promise.all([
      this.usersRepository.update(userModel),
      this.usersOldPassowrdRepository.create(
        new UserOldPassword({
          user_id: user.id,
          password: hashedPassword,
        }),
      ),
      this.userSessionsRepository.deleteAllByUserId(user.id),
      this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          activity_type: 'RESET_PASSWORD_SUCCESSFUL',
          ip_address,
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
