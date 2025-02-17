import { NotificationToken } from '@/domain/models/notifications_token.model';
import { NotificationToken as NotificationTokenEntity } from '@/infra/database/entities/notification_token.entity';

export abstract class NotificationsTokenRepository {
  abstract create(data: NotificationToken): Promise<void>;
  abstract update(data: NotificationToken): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<NotificationTokenEntity>;
  abstract findByActive(user_id: string): Promise<NotificationTokenEntity>;
  abstract findByDeviceType(data: {
    user_id: string;
    device_type: string;
  }): Promise<NotificationTokenEntity>;
  abstract findAllByUserId(userId: string): Promise<NotificationTokenEntity[]>;
  abstract deleteAllByUserId(userId: string): Promise<void>;
}
