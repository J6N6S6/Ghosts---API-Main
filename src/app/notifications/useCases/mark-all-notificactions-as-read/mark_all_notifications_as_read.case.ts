import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Injectable } from '@nestjs/common';
import { MarkAllNotificationsAsReadDTO } from './mark_all_notifications_as_read.dto';

@Injectable()
export class MarkAllNotificationsAsReadCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ user_id }: MarkAllNotificationsAsReadDTO): Promise<void> {
    await this.notificationsRepository.markAllAsRead(user_id);
  }
}
