import { CoProducers } from '@/infra/database/entities/co_producers.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class CoProducer {
  private readonly _id: string;
  private readonly _props: CoProducers;

  constructor(props: CoProducers) {
    this._id = props?.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  set user_id(user_id: string) {
    this._props.user_id = user_id;
  }

  get accepted(): boolean | null {
    return this._props.accepted;
  }

  set accepted(value: boolean) {
    this._props.accepted = value;
  }

  get commission(): number {
    return this._props.commission;
  }

  set commission(value: number) {
    this._props.commission = value;
  }

  get commission_orderbump(): number | null {
    return this._props.commission_orderbump;
  }

  set commission_orderbump(value: number) {
    this._props.commission_orderbump = value;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  set product_id(value: string) {
    this._props.product_id = value;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get joinedAt(): Date | null {
    return this._props.joinedAt;
  }

  set joinedAt(value: Date) {
    this._props.joinedAt = value;
  }

  get allProps(): CoProducers {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
