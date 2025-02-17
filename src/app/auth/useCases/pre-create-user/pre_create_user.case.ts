import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { randomPassword } from '@/shared/utils/random_password';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import { PreCreateUserDTO } from './pre_create_user.dto';

@Injectable()
export class PreCreateUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ email, name, phone, cnpj, cpf }: PreCreateUserDTO) {
    const user = await this.usersRepository.findBy({
      where: { email },
    });

    email = email.toLowerCase();

    if (user) {
    }

    const password = randomPassword();
    const userPassword = await bcrypt.hash(password, 12);

    const userModel = new User({
      email,
      name,
      phone,
      cnpj,
      cpf,
      person_type: cnpj ? 'PJ' : 'PF',
      password: userPassword,
      email_validated: true,
      account_type: 'CUSTOMER',
    });

    const newUser = await this.usersRepository.create(userModel);

    this.eventEmitter.emit('mailer.send', {
      to: {
        address: email,
      },
      template: 'USER_PRE_SIGNUP',
      template_data: {
        user_name: name,
        user_email: email,
        user_password: password,
      },
      templateId: 'd-d3b0aaf4859f42d69d6fefabbfe5e7f9',
      subject: 'Seu acesso',
    });

    return newUser;
  }
}
