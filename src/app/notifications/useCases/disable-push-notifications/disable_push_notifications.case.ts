import { NotificationsTokenRepository } from '@/domain/repositories/notifications_token.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DisablePushNotificationsCase {
  constructor(
    private readonly notificationsTokenRepository: NotificationsTokenRepository,
  ) {}

  async execute({
    user_id,
  }: {
    user_id: string;
    device_type: string;
  }): Promise<void> {
    await this.notificationsTokenRepository.deleteAllByUserId(user_id);
  }
}
