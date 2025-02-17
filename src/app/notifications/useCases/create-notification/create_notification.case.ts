import { Notification } from '@/domain/models/notifications.model';
import { UserNotificationsPreferencesRepository } from '@/domain/repositories';
import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDTO } from '../../dtos/CreateNotificationDTO';

@Injectable()
export class CreateNotificationCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userNotificationsPreferencesRepository: UserNotificationsPreferencesRepository,
  ) {}

  async execute(data: CreateNotificationDTO): Promise<Notification> {
    if (data.notification_type && data.notification_type !== null) {
      const hasActiveNotification =
        await this.userNotificationsPreferencesRepository.findByUserId(
          data.user_id,
        );

      if (!hasActiveNotification) return null;
      if (hasActiveNotification[data.notification_type] === false) return null;
    }

    const notification = new Notification({
      ...data,
      is_read: false,
    });

    await this.notificationsRepository.create(notification);

    return notification;
  }
}
