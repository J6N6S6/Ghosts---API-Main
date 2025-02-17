import { Rewards } from '@/infra/database/entities/rewards.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Reward {
  private _id: string;
  private _props: Rewards;

  constructor(props: Rewards) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._props.title;
  }

  set title(value: string) {
    this._props.title = value;
  }

  get goal(): number {
    return this._props.goal;
  }

  set goal(value: number) {
    this._props.goal = value;
  }

  get description(): string {
    return this._props.description;
  }

  set description(value: string) {
    this._props.description = value;
  }

  get image(): string {
    return this._props.image;
  }

  set image(value: string) {
    this._props.image = value;
  }

  get delivery_mode(): string {
    return this._props.delivery_mode;
  }

  set delivery_mode(value: string) {
    this._props.delivery_mode = value;
  }

  get available(): boolean {
    return this._props.available;
  }

  set available(value: boolean) {
    this._props.available = value;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get allProps(): Rewards {
    return { ...this._props, id: this._id };
  }
}
