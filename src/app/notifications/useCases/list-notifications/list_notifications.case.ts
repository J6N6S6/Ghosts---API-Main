import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { ListNotificationsDTO } from './list_notifications.dto';

@Injectable()
export class ListNotificationsCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ user_id, page = 1 }: ListNotificationsDTO) {
    const limit = 50;

    const [notifications, total_items, total_unread] = await Promise.all([
      this.notificationsRepository.find({
        where: {
          user_id,
        },
        select: [
          'id',
          'body',
          'is_read',
          'actions',
          'important',
          'icon',
          'createdAt',
        ],
        order: {
          createdAt: 'DESC',
          is_read: 'ASC',
          important: 'DESC',
        },
        ...Pagination(page, limit),
      }),
      this.notificationsRepository.count({
        where: {
          user_id,
        },
      }),
      this.notificationsRepository.count({
        where: {
          user_id,
          is_read: false,
        },
      }),
    ]);

    return {
      page,
      total_pages: Math.ceil(total_items / limit),
      total_unread,
      total_items,
      notifications,
    };
  }
}
