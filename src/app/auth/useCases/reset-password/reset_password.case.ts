import { ClientException } from '@/infra/exception/client.exception';
import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository, UsersRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { GenerateRandomString } from '../../helpers/random';
import { ResetPasswordDTO } from './reset_password.dto';

@Injectable()
export class ResetPasswordCase {
  constructor(
    private usersRepository: UsersRepository,
    private userActivityRepository: UserActivityRepository,
  ) {}

  async execute({ ip_address, email, code }: ResetPasswordDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ClientException('Usuário não encontrado');

    if (!user.reset_password_code)
      throw new ClientException('Você não solicitou a recuperação de senha');

    if (user.reset_password_attempts >= 10)
      throw new ClientException(
        'Você excedeu o limite de tentativas, tente novamente mais tarde',
      );

    const now = new Date();

    if (now > user.reset_password_expires)
      throw new ClientException('Código expirado, solicite novamente');

    const userModel = new User(user);

    if (user.reset_password_code !== code) {
      userModel.reset_password_attempts += 1;
      await this.usersRepository.update(userModel);

      throw new ClientException('Código inválido');
    }

    userModel.reset_password_code = null;
    userModel.reset_password_expires = null;
    userModel.reset_password_attempts = 0;
    userModel.reset_password_token = GenerateRandomString(128);
    userModel.reset_password_token_expires = new Date(
      new Date().getTime() + 900000, // 15 minutes
    );

    await Promise.all([
      this.usersRepository.update(userModel),
      this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          activity_type: 'RESET_PASSWORD_CODE_VALIDATED',
          ip_address,
        }),
      ),
    ]);

    return {
      token: userModel.reset_password_token,
    };
  }
}
