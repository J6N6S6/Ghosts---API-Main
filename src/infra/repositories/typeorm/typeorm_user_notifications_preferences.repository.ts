import { UserNotificationsPreferences } from '@/domain/models/user_notifications_preference.model';
import { UserNotificationsPreferencesRepository } from '@/domain/repositories/user_notifications_preferences.repository';
import { UsersNotificationsPreferences } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormUserNotificationsPreferencesRepository
  implements UserNotificationsPreferencesRepository
{
  constructor(
    @InjectRepository(UsersNotificationsPreferences)
    private readonly usersNotificationsPreferencesRepository: Repository<UsersNotificationsPreferences>,
  ) {}

  async findByUserId(user_id: string): Promise<UsersNotificationsPreferences> {
    const userNotificationsPreferences =
      await this.usersNotificationsPreferencesRepository.findOneBy({
        user: {
          id: user_id,
        },
      });

    if (!userNotificationsPreferences)
      return this.usersNotificationsPreferencesRepository.create({
        user_id,
      });

    return userNotificationsPreferences;
  }

  async findByUserEmail(email: string): Promise<UsersNotificationsPreferences> {
    return this.usersNotificationsPreferencesRepository.findOne({
      where: {
        user: {
          email,
        },
      },
    });
  }

  async update(user: UserNotificationsPreferences): Promise<void> {
    const userNotificationsPreferences =
      (await this.usersNotificationsPreferencesRepository.count({
        where: { user_id: user.user_id },
      })) > 0;

    if (userNotificationsPreferences) {
      await this.usersNotificationsPreferencesRepository.update(
        { user_id: user.user_id },
        {
          ...user.allProps,
        },
      );
    }

    await this.usersNotificationsPreferencesRepository.save({
      user_id: user.user_id,
      ...user.allProps,
    });
  }
}
