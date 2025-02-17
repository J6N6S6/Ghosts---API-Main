import { PlataformSettings } from '@/infra/database/entities';

export class PlataformSetting {
  private readonly _id: number;
  private readonly _props: PlataformSettings;

  constructor(props: PlataformSettings) {
    if (props.id) this._id = props.id;
    this._props = props;
  }

  get id(): number {
    return this._id;
  }

  get key(): string {
    return this._props.key;
  }

  get value(): string {
    return this._props.value;
  }

  set value(value: string) {
    this._props.value = value;
  }

  get description(): string | null {
    return this._props.description;
  }

  set description(description: string) {
    this._props.description = description;
  }

  get user_id(): string | null {
    return this._props.user_id;
  }

  set user_id(user_id: string) {
    this._props.user_id = user_id;
  }

  get lastEdit(): Date {
    return this._props.lastEdit;
  }

  set lastEdit(lastEdit: Date) {
    this._props.lastEdit = lastEdit;
  }

  get allProps(): PlataformSettings {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
