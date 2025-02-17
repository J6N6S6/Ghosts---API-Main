import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Notifications } from '@/infra/database/entities/notifications.entity';
import { HttpResponse } from '@/shared/@types/HttpResponse';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { NotificationToken } from '@/infra/database/entities/notification_token.entity';
import { NotificationsService } from '../services/notifications.service';
import { UpdateNotificationsSettingsBody } from '../validators/update_notifications_settings.body';

@Controller('@me/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async listUserNotifications(
    @CurrentUser('user_id') user_id: string,
    @Query('page') page: number,
  ) {
    const notifications = await this.notificationsService.listUserNotifications(
      { user_id, page: Number(page || 1) },
    );

    return {
      hasError: false,
      data: notifications,
    };
  }

  @Get('push')
  async listPushNotifications(
    @CurrentUser('user_id') userId: string,
  ): Promise<HttpResponse<NotificationToken[]>> {
    const notifications =
      await this.notificationsService.listPushNotificationsTokens(userId);

    return {
      hasError: false,
      data: notifications,
    };
  }

  @Post('push')
  async acceptPushUserNotification(
    @CurrentUser('user_id') userId: string,
    @Body()
    data: {
      device_type: string;
      device_token: string;
    },
  ): Promise<HttpResponse<Notifications[]>> {
    await this.notificationsService.acceptPushNotifications({
      device_type: data.device_type,
      notification_token: data.device_token,
      user_id: userId,
    });

    return {
      hasError: false,
      message: 'Notificações aceitas com sucesso!',
    };
  }

  @Delete('push')
  async disablePushNotifications(
    @CurrentUser('user_id') userId: string,
    @Body()
    data: {
      device_type: string;
      device_token: string;
    },
  ): Promise<HttpResponse<Notifications[]>> {
    await this.notificationsService.disablePushNotifications({
      device_type: data.device_type,
      user_id: userId,
    });

    return {
      hasError: false,
      message: 'Notificações desativadas com sucesso!',
    };
  }

  @Delete('delete/:notification_id')
  async deleteNotification(
    @CurrentUser('user_id') user_id: string,
    @Param('notification_id') notification_id: string,
  ): Promise<HttpResponse> {
    await this.notificationsService.deleteUserNotification({
      user_id,
      notification_id,
    });

    return {
      hasError: false,
      message: 'Notificação removida com sucesso!',
    };
  }

  @Delete('delete-all')
  async deleteAllUserNotifications(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    await this.notificationsService.deleteAllUserNotifications(user_id);

    return {
      hasError: false,
      message: 'Todas as notificações removidas com sucesso!',
    };
  }

  @Post('read/:notification_id')
  async markNotificationAsRead(
    @CurrentUser('user_id') user_id: string,
    @Param('notification_id') notification_id: string,
  ): Promise<HttpResponse> {
    await this.notificationsService.markNotificationAsRead({
      user_id,
      notification_id,
    });

    return {
      hasError: false,
      message: 'Notificação marcada como lida!',
    };
  }

  @Post('read-all')
  async markAllNotificationsAsRead(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    await this.notificationsService.markAllNotificationsAsRead({ user_id });

    return {
      hasError: false,
      message: 'Todas as notificações marcadas como lidas!',
    };
  }

  @Post('actions/:notification_id')
  async executateNotificationActions(
    @CurrentUser('user_id') user_id: string,
    @Param('notification_id') notification_id: string,
    @Body()
    data: {
      action: string;
    },
  ): Promise<HttpResponse> {
    await this.notificationsService.executateNotificationActions({
      user_id,
      notification_id,
      action: data.action,
    });

    return {
      hasError: false,
      message: 'Ação da notificação executada!',
    };
  }

  @Get('preferences')
  async getUserNotificationsSettings(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse<object>> {
    const settings =
      await this.notificationsService.listUserNotificationsSettings(user_id);

    return {
      hasError: false,
      data: settings,
    };
  }

  @Put('preferences')
  async updateUserNotificationsSettings(
    @CurrentUser('user_id') user_id: string,
    @Body()
    data: UpdateNotificationsSettingsBody,
  ): Promise<HttpResponse> {
    await this.notificationsService.updateUserNotificationsSettings({
      user_id,
      data,
    });

    return {
      hasError: false,
      message: 'Configurações das notificações atualizadas',
    };
  }
}
