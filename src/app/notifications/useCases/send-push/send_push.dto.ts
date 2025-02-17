import { NotificationsPreferencesEnum } from '@/infra/database/types/user.types';

export interface SendPushNotificationDTO {
  user_id: string;
  notification_type: NotificationsPreferencesEnum | null;
  notification: {
    title: string;
    body: string;
    sound?: string;
  };
}
