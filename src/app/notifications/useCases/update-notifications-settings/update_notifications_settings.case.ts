import { UserNotificationsPreferences } from '@/domain/models/user_notifications_preference.model';
import { UserNotificationsPreferencesRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { updateNotificationsSettingsDTO } from './update_notifications_settings.dto';
@Injectable()
export class updateNotificationsSettingsCase {
  constructor(
    private readonly userNotificationsPreferencesRepository: UserNotificationsPreferencesRepository,
  ) {}

  async execute({ data, user_id }: updateNotificationsSettingsDTO) {
    const user_notifications =
      await this.userNotificationsPreferencesRepository.findByUserId(user_id);

    if (!user_notifications) {
      throw new ClientException('Usuário não encontrado');
    }

    const user_notification = new UserNotificationsPreferences(
      user_notifications,
    );

    for (const key in data) {
      user_notification[key] = data[key];
    }

    await this.userNotificationsPreferencesRepository.update(user_notification);
  }
}
