import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { AcceptPushNotificationsCase } from './useCases/accept-push-notifications/accept_push_notifications.case';
import { CreateNotificationCase } from './useCases/create-notification/create_notification.case';
import { DeleteAllNotificationsCase } from './useCases/delete-all-notifications/delete_all_notifications.case';
import { DeleteNotificationCase } from './useCases/delete-notification/delete_notification.case';
import { DisablePushNotificationsCase } from './useCases/disable-push-notifications/disable_push_notifications.case';
import { ExecutateNotificationActionsCase } from './useCases/executate-notification-actions/executate_notification_actions.case';
import { ListNotificationsSettingsCase } from './useCases/list-notifications-settings/list_notifications_settings.case';
import { ListNotificationsCase } from './useCases/list-notifications/list_notifications.case';
import { ListPushNotificationCase } from './useCases/list-push-notifications/list_push_notifications.case';
import { MarkAllNotificationsAsReadCase } from './useCases/mark-all-notificactions-as-read/mark_all_notifications_as_read.case';
import { MarkNotificationAsReadCase } from './useCases/mark-notificaction-as-read/mark_notification_as_read.case';
import { SendPushNotificationCase } from './useCases/send-push/send_push.case';
import { updateNotificationsSettingsCase } from './useCases/update-notifications-settings/update_notifications_settings.case';

@Module({
  imports: [InfraModule],
  providers: [
    NotificationsService,
    CreateNotificationCase,
    DeleteNotificationCase,
    DeleteAllNotificationsCase,
    ListNotificationsCase,
    ListNotificationsSettingsCase,
    AcceptPushNotificationsCase,
    DisablePushNotificationsCase,
    updateNotificationsSettingsCase,
    SendPushNotificationCase,
    ListPushNotificationCase,
    MarkAllNotificationsAsReadCase,
    MarkNotificationAsReadCase,
    ExecutateNotificationActionsCase,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
