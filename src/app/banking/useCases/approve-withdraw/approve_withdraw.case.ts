import { Withdraw } from '@/domain/models/withdraw.model';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApproveWithdrawDTO } from './approve_withdraw.dto';

@Injectable()
export class ApproveWithdrawCase {
  constructor(
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ user_id, withdraw_id }: ApproveWithdrawDTO): Promise<any> {
    const withdraw = await this.withdrawalsRepository.findById(withdraw_id);

    if (!withdraw) throw new ClientException('Saque não encontrado');

    const withdrawModel = new Withdraw(withdraw);

    if (withdrawModel.status !== 'pending')
      throw new ClientException('Este saque já foi aprovado');

    withdrawModel.status = 'approved';
    withdrawModel.approved_at = new Date();
    withdrawModel.approved_by = user_id;

    await this.withdrawalsRepository.update(withdrawModel);

    const valueFormatted = withdrawModel.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.eventEmitter.emit('notification.send', {
      user_id: withdrawModel.user_id,
      body: `Seu saque no valor de ${valueFormatted} foi aprovado!`,
      icon: 'success',
      important: false,
    });
    this.eventEmitter.emit('push_notification.send', {
      user_id: withdrawModel.user_id,
      notification: {
        title: 'Seu saque foi aprovado',
        body: `O saque de ${valueFormatted} foi aprovado!`,
      },
    });
  }
}
