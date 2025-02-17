import { NotificationsTokenRepository } from '@/domain/repositories/notifications_token.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListPushNotificationCase {
  constructor(
    private readonly notificationsTokenRepository: NotificationsTokenRepository,
  ) {}

  async execute(user_id: string) {
    const notifications =
      this.notificationsTokenRepository.findAllByUserId(user_id);

    return notifications;
  }
}
