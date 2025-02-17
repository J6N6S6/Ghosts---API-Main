import { UsersNotificationsPreferences } from '@/infra/database/entities';
import { UserNotificationsPreferences } from '../models/user_notifications_preference.model';

export abstract class UserNotificationsPreferencesRepository {
  abstract findByUserId(
    user_id: string,
  ): Promise<UsersNotificationsPreferences>;
  abstract findByUserEmail(
    email: string,
  ): Promise<UsersNotificationsPreferences>;
  abstract update(user: UserNotificationsPreferences): Promise<void>;
}
