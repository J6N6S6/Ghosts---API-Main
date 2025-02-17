import { NotificationToken } from '@/domain/models/notifications_token.model';
import { NotificationsTokenRepository } from '@/domain/repositories/notifications_token.repository';
import { NotificationToken as Notifications } from '@/infra/database/entities/notification_token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormNotificationsTokenRepository
  implements NotificationsTokenRepository
{
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  async create(data: NotificationToken): Promise<void> {
    await this.notificationsRepository.save({
      id: data.id,
      user_id: data.user_id,
      device_type: data.device_type,
      notification_token: data.notification_token,
      status: data.status,
    });
  }

  async update(data: NotificationToken): Promise<void> {
    await this.notificationsRepository.update(
      { id: data.id },
      {
        user_id: data.user_id,
        device_type: data.device_type,
        notification_token: data.notification_token,
        status: data.status,
      },
    );
  }

  async delete(id: string): Promise<void> {
    await this.notificationsRepository.delete(id);
  }

  findById(id: string): Promise<Notifications> {
    return this.notificationsRepository.findOneBy({ id });
  }

  findByActive(user_id: string): Promise<Notifications> {
    return this.notificationsRepository.findOneBy({
      user_id,
      status: 'ACTIVE',
    });
  }

  findAllByUserId(userId: string): Promise<Notifications[]> {
    return this.notificationsRepository.findBy({ user_id: userId });
  }

  findByDeviceType(data: {
    user_id: string;
    device_type: string;
  }): Promise<Notifications> {
    return this.notificationsRepository.findOneBy({
      user_id: data.user_id,
      device_type: data.device_type,
    });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.notificationsRepository.delete({
      user_id: userId,
    });
  }
}
