import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { CreateNotificationDTO } from '../dtos/CreateNotificationDTO';
import { CreateNotificationTokenDTO } from '../dtos/CreateNotificationTokenDTO';
import { AcceptPushNotificationsCase } from '../useCases/accept-push-notifications/accept_push_notifications.case';
import { CreateNotificationCase } from '../useCases/create-notification/create_notification.case';
import { DeleteAllNotificationsCase } from '../useCases/delete-all-notifications/delete_all_notifications.case';
import { DeleteNotificationCase } from '../useCases/delete-notification/delete_notification.case';
import { DeleteNotificationDTO } from '../useCases/delete-notification/delete_notification.dto';
import { DisablePushNotificationsCase } from '../useCases/disable-push-notifications/disable_push_notifications.case';
import { ExecutateNotificationActionsCase } from '../useCases/executate-notification-actions/executate_notification_actions.case';
import { ExecutateNotificationActionsDTO } from '../useCases/executate-notification-actions/executate_notification_actions.dto';
import { ListNotificationsSettingsCase } from '../useCases/list-notifications-settings/list_notifications_settings.case';
import { ListNotificationsCase } from '../useCases/list-notifications/list_notifications.case';
import { ListNotificationsDTO } from '../useCases/list-notifications/list_notifications.dto';
import { ListPushNotificationCase } from '../useCases/list-push-notifications/list_push_notifications.case';
import { MarkAllNotificationsAsReadCase } from '../useCases/mark-all-notificactions-as-read/mark_all_notifications_as_read.case';
import { MarkAllNotificationsAsReadDTO } from '../useCases/mark-all-notificactions-as-read/mark_all_notifications_as_read.dto';
import { MarkNotificationAsReadCase } from '../useCases/mark-notificaction-as-read/mark_notification_as_read.case';
import { MarkNotificationAsReadDTO } from '../useCases/mark-notificaction-as-read/mark_notification_as_read.dto';
import { SendPushNotificationCase } from '../useCases/send-push/send_push.case';
import { SendPushNotificationDTO } from '../useCases/send-push/send_push.dto';
import { updateNotificationsSettingsCase } from '../useCases/update-notifications-settings/update_notifications_settings.case';
import { OnEvent } from '@nestjs/event-emitter';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationsService {
  constructor(
    private readonly createNotification: CreateNotificationCase,
    private readonly deleteNotification: DeleteNotificationCase,
    private readonly deleteAllNotifications: DeleteAllNotificationsCase,
    private readonly listNotifications: ListNotificationsCase,
    private readonly listNotificationsSettings: ListNotificationsSettingsCase,
    private readonly updateNotificationsSettings: updateNotificationsSettingsCase,
    private readonly acceptPushNotificationsCase: AcceptPushNotificationsCase,
    private readonly disablePushNotificationsCase: DisablePushNotificationsCase,
    private readonly sendPushNotificationCase: SendPushNotificationCase,
    private readonly listPushNotificationCase: ListPushNotificationCase,
    private readonly markNotificationAsReadCase: MarkNotificationAsReadCase,
    private readonly markAllNotificationsAsReadCase: MarkAllNotificationsAsReadCase,
    private readonly executateNotificationActionsCase: ExecutateNotificationActionsCase,
  ) {}

  @OnEvent('notification.send')
  async sendNotification(data: CreateNotificationDTO) {
    await this.createNotification.execute(data);
  }

  @OnEvent('push_notification.send')
  async sendPushNotification(data: SendPushNotificationDTO): Promise<void> {
    await this.sendPushNotificationCase.execute(data);
  }

  async acceptPushNotifications(
    data: CreateNotificationTokenDTO,
  ): Promise<void> {
    await this.acceptPushNotificationsCase.execute(data);
  }

  async listUserNotifications(data: ListNotificationsDTO) {
    return this.listNotifications.execute(data);
  }

  @OnEvent('notification.delete')
  async deleteUserNotification(data: DeleteNotificationDTO) {
    return this.deleteNotification.execute(data);
  }

  async deleteAllUserNotifications(user_id: string) {
    return this.deleteAllNotifications.execute({
      user_id,
    });
  }

  async updateUserNotificationsSettings({
    data,
    user_id,
  }: {
    data: any;
    user_id: string;
  }) {
    return this.updateNotificationsSettings.execute({
      data,
      user_id,
    });
  }

  async listUserNotificationsSettings(user_id: string): Promise<object> {
    return this.listNotificationsSettings.execute(user_id);
  }

  async disablePushNotifications({
    user_id,
    device_type,
  }: {
    user_id: string;
    device_type: string;
  }) {
    return this.disablePushNotificationsCase.execute({
      user_id,
      device_type,
    });
  }

  async listPushNotificationsTokens(user_id: string) {
    return this.listPushNotificationCase.execute(user_id);
  }

  async markNotificationAsRead(data: MarkNotificationAsReadDTO) {
    return this.markNotificationAsReadCase.execute(data);
  }

  async markAllNotificationsAsRead(data: MarkAllNotificationsAsReadDTO) {
    return this.markAllNotificationsAsReadCase.execute(data);
  }

  async executateNotificationActions(data: ExecutateNotificationActionsDTO) {
    return this.executateNotificationActionsCase.execute(data);
  }
}
