import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository } from '@/domain/repositories';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { TwilioService } from '@/infra/services/twilio.service';
import { Injectable } from '@nestjs/common';
import { ChangeUserPhoneDTO } from './change_user_phone.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class ChangeUserPhoneCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly twilioService: TwilioService,
    private readonly userActivityRepository: UserActivityRepository,
  ) {}

  async execute({
    user_id,
    phone,
    method,
    ip_address,
  }: ChangeUserPhoneDTO): Promise<any> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new ClientException('Usuário não encontrado');
    }

    const user = new User(userExists);

    if (user.phone === phone && user.phone_validated)
      throw new ClientException('O número de telefone já está validado');

    user.phone = phone;
    user.phone_validated = false;

    const phoneVerify = await this.twilioService.sendVerifyCode(phone, method);

    if (phoneVerify.status !== 'pending') {
      throw new ClientException(
        'Não foi possível enviar o código de verificação',
      );
    }

    await this.usersRepository.update(user);

    await this.userActivityRepository.create(
      new UserActivity({
        user_id,
        activity_type: 'CHANGE_PHONE_NUMBER',
        metadata: {
          old_phone: userExists.phone,
          new_phone: phone,
          verification_method: method,
        },
        ip_address,
      }),
    );
  }
}
