import { Notification } from '@/domain/models/notifications.model';
import { NotificationsRepository } from '@/domain/repositories/notifications.repository';
import { Notifications } from '@/infra/database/entities/notifications.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormNotificationsRepository implements NotificationsRepository {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  async create(data: Notification): Promise<void> {
    await this.notificationsRepository.save({
      ...data.getAll,
    });
  }

  async delete(id: string): Promise<void> {
    await this.notificationsRepository.delete(id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.notificationsRepository.delete({
      user_id: userId,
    });
  }

  findById(id: string): Promise<Notifications> {
    return this.notificationsRepository.findOneBy({ id });
  }

  findAllByUserId(userId: string): Promise<Notifications[]> {
    return this.notificationsRepository.findBy({ user_id: userId });
  }

  async markAsRead(userId: string, notification_id: string): Promise<void> {
    await this.notificationsRepository.update(
      { id: notification_id, user_id: userId },
      { is_read: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { user_id: userId },
      { is_read: true },
    );
  }

  findOne(options?: FindOneOptions<Notifications>): Promise<Notifications> {
    return this.notificationsRepository.findOne(options);
  }

  find(options: FindManyOptions<Notifications>): Promise<Notifications[]> {
    return this.notificationsRepository.find(options);
  }

  count(options: FindManyOptions<Notifications>): Promise<number> {
    return this.notificationsRepository.count(options);
  }
}
