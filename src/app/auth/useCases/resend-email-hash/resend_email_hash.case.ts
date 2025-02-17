import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateRandomString } from '../../helpers/random';
import { ResendEmailHashDTO } from './resend_email_hash.dto';

@Injectable()
export class ResendEmailHashCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ email }: ResendEmailHashDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ClientException('Usuário não encontrado');
    }

    if (user.email_validated) {
      throw new ClientException('Email já validado');
    }

    if (!user.email_hash) {
      const userModel = new User(user);
      const emailHash = GenerateRandomString(128);
      user.email_hash = emailHash;
      userModel.email_hash = emailHash;
      await this.usersRepository.update(userModel);
    }

    this.eventEmitter.emit('mailer.send', {
      template: 'USER_CONFIRM_EMAIL',
      template_type: null,
      template_data: {
        name: user.name,
        email,
        email_hash: user.email_hash,
      },
      to: {
        name: user.name,
        address: email,
      },
    });

    return;
  }
}
