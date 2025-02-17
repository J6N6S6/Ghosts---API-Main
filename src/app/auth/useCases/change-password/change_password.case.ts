import { UserActivity } from '@/domain/models/user_activity.model';
import { UserOldPassword } from '@/domain/models/user_old_password.model';
import { User } from '@/domain/models/users.model';
import {
  UserActivityRepository,
  UserOldPasswordsRepository,
  UserSessionsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Not } from 'typeorm';
import { ChangePasswordDTO } from './change_password.dto';

@Injectable()
export class ChangePasswordCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersOldPassowrdRepository: UserOldPasswordsRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async execute({
    user_id,
    old_password,
    new_password,
    ip_address,
    session_secret,
  }: ChangePasswordDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Houve um erro ao buscar o usuário');

    const passwordMatch = await bcrypt.compare(old_password, user.password);

    if (!passwordMatch)
      throw new ClientException('Senha atual está incorreta!');

    const oldPassword = await this.usersOldPassowrdRepository.find({
      where: {
        user_id,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });

    const oldPasswords = oldPassword.map((password) => password.password);

    const oldPasswordMatch = oldPasswords.find((password) =>
      bcrypt.compareSync(new_password, password),
    );

    if (oldPasswordMatch)
      throw new ClientException(
        'Essa senha já foi utilizada antes, tente novamente com uma outra senha!',
      );

    const userModel = new User(user);

    const userPassword = await bcrypt.hash(new_password, 12);

    userModel.password = userPassword;

    await this.usersRepository.update(userModel);

    const newPassRecord = new UserOldPassword({
      user_id,
      password: userPassword,
    });

    await Promise.all([
      this.usersOldPassowrdRepository.create(newPassRecord),
      this.userActivityRepository.create(
        new UserActivity({
          activity_type: 'PASSWORD_CHANGED',
          ip_address: ip_address,
          user_id,
        }),
      ),
      this.userSessionsRepository.deleteAllByUserId(user_id, {
        token: Not(session_secret),
      }),
    ]);
  }
}
