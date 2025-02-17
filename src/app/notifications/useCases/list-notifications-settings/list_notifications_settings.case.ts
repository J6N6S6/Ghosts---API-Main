import { UserNotificationsPreferencesRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListNotificationsSettingsCase {
  constructor(
    private readonly userNotificationsPreferencesRepository: UserNotificationsPreferencesRepository,
  ) {}

  async execute(user_id: string): Promise<object> {
    return this.userNotificationsPreferencesRepository.findByUserId(user_id);
  }
}
