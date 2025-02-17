import { UserOldPasswords } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserOldPassword {
  private _id: string;
  private _props: UserOldPasswords;

  constructor(props: UserOldPasswords) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;

    if (!props.createdAt) {
      this._props.createdAt = new Date();
    }
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get password(): string {
    return this._props.password;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get allProps(): UserOldPasswords {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
