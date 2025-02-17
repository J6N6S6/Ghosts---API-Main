import { UserNotificationsPreferencesRepository } from '@/domain/repositories';
import { NotificationsTokenRepository } from '@/domain/repositories/notifications_token.repository';
import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { SendPushNotificationDTO } from './send_push.dto';

@Injectable()
export class SendPushNotificationCase {
  constructor(
    private readonly notificationsTokenRepository: NotificationsTokenRepository,
    private readonly userNotificationsPreferencesRepository: UserNotificationsPreferencesRepository,
  ) {}

  async execute({
    user_id,
    notification,
    notification_type = null,
  }: SendPushNotificationDTO): Promise<any> {
    try {
      const notificationToken =
        await this.notificationsTokenRepository.findByActive(user_id);

      if (notification_type !== null) {
        const hasActiveNotification =
          await this.userNotificationsPreferencesRepository.findByUserId(
            user_id,
          );

        const userHasPreference =
          hasActiveNotification[notification_type] === true;

        if (hasActiveNotification && !userHasPreference) {
          return null;
        }
      }

      if (notificationToken) {
        console.log('Sending push notification to:', notificationToken);
        const deviceType = notificationToken.notification_token.startsWith(
          'ExponentPushToken',
        )
          ? 'IOS'
          : 'ANDROID';

        if (deviceType === 'ANDROID' || deviceType === 'IOS')
          return await firebase.messaging().send({
            notification: {
              title: notification.title,
              body: notification.body,
            },
            token: notificationToken.notification_token,
            android: {
              priority: 'high',
              notification: { sound: notification.sound || 'default' },
            },
            apns: {
              payload: {
                aps: {
                  sound: notification.sound || 'default',
                },
              },
            },
          });

        return null;
      }
    } catch (error) {
      return error;
    }
  }
}
