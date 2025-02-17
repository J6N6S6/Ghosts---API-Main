import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as dayjs from 'dayjs';

@Injectable()
export class AddInviteCodeCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user_id,
    invite_code,
  }: {
    user_id: string;
    invite_code: string;
  }) {
    if (!invite_code)
      throw new ClientException('Código de convite não informado');

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    // verify user.createdAt is before 48 hours
    if (dayjs().diff(dayjs(user.createdAt), 'hour') > 48)
      throw new ClientException(
        'Você não pode mais usar esse código de convite',
      );

    if (user.indicated_by)
      throw new ClientException('Você já possui um código de convite');

    const userCode = await this.usersRepository.findByHashLink(invite_code);

    if (!userCode) throw new ClientException('Código de convite inválido');
    if (userCode.id === user.id)
      throw new ClientException(
        'Você não pode usar seu próprio código de convite',
      );

    const userQuery = new User(user);
    user.indicated_by = userCode.id;

    await this.usersRepository.update(userQuery);

    this.eventEmitter.emit('notification.send', {
      user_id: userCode.id,
      body: `O usuário **${user.name}** se cadastrou usando seu código de convite`,
      icon: 'success',
    });
  }
}
