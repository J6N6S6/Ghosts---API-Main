import { Notifications } from '@/infra/database/entities/notifications.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Notification {
  private readonly _id: string;
  private readonly _props: Notifications;

  constructor(data: Notifications) {
    this._id = data.id || GenerateUUID.generate();
    this._props = data;

    if (!data.createdAt) {
      this._props.createdAt = new Date();
    }
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get body(): string {
    return this._props.body;
  }

  get actions(): Notifications['actions'] {
    return this._props.actions;
  }

  set actions(value: Notifications['actions']) {
    this._props.actions = value;
  }

  get action_data(): any {
    return this._props.action_data;
  }

  get action_type(): string {
    return this._props.action_type;
  }

  get is_read(): boolean {
    return this._props.is_read;
  }

  set is_read(value: boolean) {
    this._props.is_read = value;
  }

  get important(): boolean {
    return this._props.important;
  }

  get icon(): 'info' | 'warning' | 'error' | 'success' | string {
    return this._props.icon;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get getAll(): Notifications {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
