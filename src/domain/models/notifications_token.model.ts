import { NotificationToken as NotificationTokenEntity } from '@/infra/database/entities/notification_token.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class NotificationToken {
  private readonly _id: string;
  private readonly _props: NotificationTokenEntity;

  constructor(data: NotificationTokenEntity) {
    this._id = data.id || GenerateUUID.generate();
    this._props = data;
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get device_type(): string {
    return this._props.device_type;
  }

  get notification_token(): string {
    return this._props.notification_token;
  }

  get status(): string {
    return this._props.status;
  }

  set status(status: string) {
    this._props.status = status;
  }

  getAll(): NotificationTokenEntity {
    return this._props;
  }
}
