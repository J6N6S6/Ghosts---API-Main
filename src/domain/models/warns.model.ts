import { Warns } from '@/infra/database/entities/warns.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Warn {
  private readonly _id: string;
  private readonly _props: Warns;

  constructor(props: Warns) {
    this._id = props.id ?? GenerateUUID.generate();
    this._props = props;
    this._props.created_at = this._props.created_at ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._props.title;
  }

  get description(): string | null {
    if (!this._props.description) {
      return null;
    }

    return this._props.description;
  }

  get status(): 'CRITICAL' | 'LOW' {
    return this._props.status;
  }

  get created_by(): string {
    return this._props.created_by;
  }

  set title(value: string) {
    this._props.title = value;
  }

  set description(value: string) {
    this._props.description = value;
  }

  set status(value: 'CRITICAL' | 'LOW') {
    this._props.status = value;
  }

  toOutput() {
    return {
      id: this._id,
      title: this._props.title,
      description: this._props.description,
      status: this._props.status,
      created_by: this._props.created_by,
      created_at: this._props.created_at,
    };
  }
}
