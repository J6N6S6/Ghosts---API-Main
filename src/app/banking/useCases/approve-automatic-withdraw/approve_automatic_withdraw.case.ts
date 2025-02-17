import { Withdraw } from '@/domain/models/withdraw.model';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApproveWithdrawDTO } from './approve_automatic_withdraw.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UsersRepository } from '@/domain/repositories';
import { ServerException } from '@/infra/exception/server.exception';

@Injectable()
export class ApproveAutomaticWithdrawCase {
  constructor(
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ user_id, withdraw_id }: ApproveWithdrawDTO): Promise<any> {
    const withdraw = await this.withdrawalsRepository.findOne({
      where: { id: withdraw_id },
      relations: ['user'],
    });

    if (!withdraw) throw new ClientException('Saque não encontrado');
    const user = withdraw.user;

    if (!user) throw new ClientException('Usuário não encontrado');

    const pix_key_type: {
      [key: string]: string;
    } = {
      CPF: 'DOCUMENT',
      CNPJ: 'DOCUMENT',
      PHONE: 'PHONE',
      EMAIL: 'MAIL',
      RANDOM: 'RANDOM_KEY',
    };

    const request_data = {
      type: 'PIX',
      value: withdraw.amount,
      details: {
        key: this.removeMask(withdraw.bank_account.pix_key),
        keyType: pix_key_type[withdraw.bank_account.pix_type.toUpperCase()],
        name: user.name,
        document: this.removeMask(user.cpf || user.cnpj),
      },
      externalId: withdraw.id,
    };

    const { data } = await this.httpService.axiosRef.post(
      'https://api.firebanking.io/payment/withdraw',
      request_data,
      {
        headers: {
          apiKey: this.configService.get('firebanking.api_key'),
        },
      },
    );

    if (data.status !== 'WITHDRAW_REQUEST' || !data) {
      throw new ClientException(
        'Saque não foi aprovado, não foi possivel fazer o envio do dinheiro.',
        500,
      );
    }

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
        body: `O saque de ${valueFormatted} foi aprovado! `,
      },
    });
  }

  removeMask(value: string): string {
    if (!value) throw new ServerException('Chave PIX não encontrada');

    const cleanValue = value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

    // Verifica se o valor é um CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleanValue.length === 11 || cleanValue.length === 14) {
      return cleanValue;
    }

    // Se não for CPF ou CNPJ, retorna o valor original
    return value;
  }
}
