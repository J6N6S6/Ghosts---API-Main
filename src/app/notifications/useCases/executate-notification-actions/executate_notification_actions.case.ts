import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExecutateNotificationActionsDTO } from './executate_notification_actions.dto';
import { AffiliationActionControlDTO } from '@/app/products_affiliates/useCases/affiliation-action-control/affiliation_action_control.dto';

@Injectable()
export class ExecutateNotificationActionsCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user_id,
    action,
    notification_id,
  }: ExecutateNotificationActionsDTO): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notification_id,
    );

    if (!notification) {
      throw new ClientException('Notificação não encontrada');
    }

    if (notification.user_id !== user_id) {
      throw new ClientException('Você não pode executar essa ação');
    }

    switch (notification.action_type) {
      case 'CO_PRODUCER_INVITE':
        this.eventEmitter.emit('CO_PRODUCER_INVITE', {
          user_id,
          product_id: notification.action_data.product_id,
          accepted: action === 'accept',
          notification_id,
        });
        break;
      case 'AFFILIATION_REQUEST':
        this.eventEmitter.emit('AFFILIATION_REQUEST', {
          affiliation_id: notification.action_data.affiliation_id,
          user_id,
          action: action as AffiliationActionControlDTO['action'],
          product_id: notification.action_data.product_id,
        } as AffiliationActionControlDTO);

        await this.notificationsRepository.delete(notification_id);
        break;
    }
  }
}
