import { UserActivity } from '@/domain/models/user_activity.model';
import { User } from '@/domain/models/users.model';
import { UserActivityRepository } from '@/domain/repositories';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { TwilioService } from '@/infra/services/twilio.service';
import { Injectable } from '@nestjs/common';
import { ValidateUserPhoneDTO } from './validate_user_phone.dto';

@Injectable()
export class ValidateUserPhoneCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly twilioService: TwilioService,
    private readonly userActivityRepository: UserActivityRepository,
  ) {}

  async execute({
    user_id,
    phone,
    code,
    ip_address,
  }: ValidateUserPhoneDTO): Promise<any> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new ClientException('Usuário não encontrado');
    }

    if (userExists.phone === phone && userExists.phone_validated)
      throw new ClientException('O número de telefone já está validado');

    if (userExists.phone !== phone) {
      throw new ClientException('O número de telefone não confere');
    }

    const phoneVerify = await this.twilioService.checkVerifyCode(phone, code);

    if (!phoneVerify.verified) {
      throw new ClientException('Código de verificação inválido');
    }

    const user = new User(userExists);
    user.phone_validated = true;

    await this.usersRepository.update(user);

    await this.userActivityRepository.create(
      new UserActivity({
        user_id,
        activity_type: 'VALIDATE_PHONE_NUMBER',
        ip_address,
      }),
    );
  }
}
