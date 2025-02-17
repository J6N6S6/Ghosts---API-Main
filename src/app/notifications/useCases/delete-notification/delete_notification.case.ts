import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Injectable } from '@nestjs/common';
import { DeleteNotificationDTO } from './delete_notification.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class DeleteNotificationCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    notification_id,
    user_id,
  }: DeleteNotificationDTO): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notification_id,
    );

    if (!notification) {
      throw new ClientException('Notificação não encontrada');
    }

    if (notification.user_id !== user_id) {
      throw new ClientException('Você não pode deletar essa notificação');
    }

    await this.notificationsRepository.delete(notification_id);
  }
}
