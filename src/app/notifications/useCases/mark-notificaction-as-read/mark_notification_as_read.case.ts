import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Injectable } from '@nestjs/common';
import { MarkNotificationAsReadDTO } from './mark_notification_as_read.dto';

@Injectable()
export class MarkNotificationAsReadCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    user_id,
    notification_id,
  }: MarkNotificationAsReadDTO): Promise<void> {
    await this.notificationsRepository.markAsRead(user_id, notification_id);
  }
}
