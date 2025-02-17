import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import { GenerateRandomString } from '../../helpers/random';
import { CreateUserDTO } from './create_user.dto';
import { AddInviteCodeCase } from '../add-invite-code/add_invite_code.case';

@Injectable()
export class CreateUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly addInviteCodeCase: AddInviteCodeCase,
  ) {}

  async execute({
    email,
    name,
    phone,
    cnpj,
    cpf,
    password,
    invite_code,
  }: CreateUserDTO) {
    const user = await this.usersRepository.findBy({
      where: [{ email }, { cpf }, { cnpj }],
    });

    email = email.toLowerCase();

    if (user) {
      if (
        !user.email_validated &&
        user.createdAt < new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ) {
        // delete user
        await this.usersRepository.deleteByEmail(email);
      } else {
        const field =
          user.email === email ? 'email' : user.cpf === cpf ? 'cpf' : 'cnpj';
        throw new ClientException(`Já existe um usuário com esse ${field}!`);
      }
    }

    const userPassword = await bcrypt.hash(password, 12);
    const emailHash = GenerateRandomString(128);

    const userModel = new User({
      email,
      name,
      phone,
      cnpj,
      cpf,
      person_type: cnpj ? 'PJ' : 'PF',
      password: userPassword,
      email_validated: false,
      email_hash: emailHash,
    });

    const userCreated = await this.usersRepository.create(userModel);

    this.eventEmitter.emit('mailer.send', {
      template: 'USER_CONFIRM_EMAIL',
      template_type: null,
      to: {
        name: userCreated.name,
        address: userCreated.email,
      },
      template_data: {
        email_hash: userCreated.email_hash,
        email: userCreated.email,
      },
      subject: `Confirmar endereço de email`,
      templateId: 'd-67b1168c3ff8475bbadac87b1bfac0d8',
    });

    if (invite_code) {
      await this.addInviteCodeCase.execute({
        user_id: userCreated.id,
        invite_code: invite_code,
      });
    }

    return;
  }
}
