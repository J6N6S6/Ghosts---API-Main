import { Notification } from '@/domain/models/notifications.model';
import { Notifications } from '@/infra/database/entities/notifications.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class NotificationsRepository {
  abstract create(data: Notification): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract deleteAllByUserId(userId: string): Promise<void>;
  abstract findById(id: string): Promise<Notifications>;
  abstract findAllByUserId(userId: string): Promise<Notifications[]>;
  abstract markAsRead(userId: string, notification_id: string): Promise<void>;
  abstract markAllAsRead(userId: string): Promise<void>;
  abstract findOne(
    options?: FindOneOptions<Notifications>,
  ): Promise<Notifications>;
  abstract find(
    options: FindManyOptions<Notifications>,
  ): Promise<Notifications[]>;
  abstract count(options: FindManyOptions<Notifications>): Promise<number>;
}
