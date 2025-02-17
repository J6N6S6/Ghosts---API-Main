import { NotificationToken } from '@/domain/models/notifications_token.model';
import { NotificationsTokenRepository } from '@/domain/repositories/notifications_token.repository';
import { Injectable } from '@nestjs/common';
import { CreateNotificationTokenDTO } from '../../dtos/CreateNotificationTokenDTO';

@Injectable()
export class AcceptPushNotificationsCase {
  constructor(
    private readonly notificationsTokenRepository: NotificationsTokenRepository,
  ) {}

  async execute(data: CreateNotificationTokenDTO): Promise<void> {
    // if (data.device_type !== 'IOS' && data.device_type !== 'ANDROID')
    //   throw new ClientException('Tipo de dispositivo inválido');

    const notification = new NotificationToken({
      user_id: data.user_id,
      device_type: data.device_type,
      notification_token: data.notification_token,
      status: 'ACTIVE',
    });
    await this.notificationsTokenRepository.deleteAllByUserId(data.user_id);
    await this.notificationsTokenRepository.create(notification);
  }
}
