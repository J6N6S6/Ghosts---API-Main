import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository, UsersRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestResetPasswordDTO } from './request_reset_password.dto';

@Injectable()
export class RequestResetPasswordCase {
  constructor(
    private usersRepository: UsersRepository,
    private userActivityRepository: UserActivityRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ ip_address, email }: RequestResetPasswordDTO) {
    // 1. Check if user exists
    // 2. Generate token
    // 3. Send email

    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ClientException('Usuário não encontrado');

    if (user.reset_password_code) {
      const now = new Date();
      if (now < user.reset_password_expires) {
        return this.eventEmitter.emit('mailer.send', {
          template: 'USER_RESET_PASSWORD',
          template_type: null,
          to: {
            name: user.name,
            address: user.email,
          },
          template_data: {
            name: user.name,
            code_1: user.reset_password_code[0],
            code_2: user.reset_password_code[1],
            code_3: user.reset_password_code[2],
            code_4: user.reset_password_code[3],
            code_5: user.reset_password_code[4],
            code_6: user.reset_password_code[5],
          },
          subject: `Recuperação de senha`,
          templateId: 'd-62a4954d0d574e4382a0a0336100eac0',
        });
      }

      if (
        user.reset_password_attempts >= 10 &&
        now < user.reset_password_expires
      ) {
        throw new ClientException(
          'Você excedeu o limite de tentativas, tente novamente mais tarde',
        );
      }
    }

    const userModel = new User(user);

    // generate 6 digit code number
    const code = Math.floor(100000 + Math.random() * 900000);

    userModel.reset_password_code = code.toString();
    userModel.reset_password_expires = new Date(new Date().getTime() + 600000); // 10 minutes
    userModel.reset_password_attempts = 0;

    await Promise.all([
      this.usersRepository.update(userModel),
      this.eventEmitter.emit('mailer.send', {
        template: 'USER_RESET_PASSWORD',
        template_type: null,
        to: {
          name: user.name,
          address: user.email,
        },
        template_data: {
          name: user.name,
          code_1: userModel.reset_password_code[0],
          code_2: userModel.reset_password_code[1],
          code_3: userModel.reset_password_code[2],
          code_4: userModel.reset_password_code[3],
          code_5: userModel.reset_password_code[4],
          code_6: userModel.reset_password_code[5],
        },
        subject: `Recuperação de senha`,
        templateId: 'd-62a4954d0d574e4382a0a0336100eac0',
      }),
      this.userActivityRepository.create(
        new UserActivity({
          user_id: user.id,
          activity_type: 'RESET_PASSWORD_REQUEST',
          ip_address,
        }),
      ),
    ]);
  }
}
