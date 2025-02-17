import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Injectable } from '@nestjs/common';
import { DeleteAllNotificationsDTO } from './delete_all_notifications.dto';

@Injectable()
export class DeleteAllNotificationsCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ user_id }: DeleteAllNotificationsDTO): Promise<void> {
    await this.notificationsRepository.deleteAllByUserId(user_id);
  }
}
