import { Purchases } from '@/infra/database/entities/purchases.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Purchase {
  private readonly _id: string;
  private readonly _props: Purchases;

  constructor(props: Purchases) {
    this._id = props?.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get transaction_id(): string | null {
    return this._props.transaction_id;
  }

  set transaction_id(value: string | null) {
    this._props.transaction_id = value;
  }

  get evaluation(): number | null {
    return this._props.evaluation;
  }

  set evaluation(data: number | null) {
    this._props.evaluation = data;
  }

  get blocked_comments(): boolean {
    return this._props.blocked_comments;
  }

  set blocked_comments(data: boolean) {
    this._props.blocked_comments = data;
  }

  get watched_lessons(): Purchases['watched_lessons'] {
    return this._props.watched_lessons;
  }

  set watched_lessons(data: Purchases['watched_lessons']) {
    this._props.watched_lessons = data;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  set updatedAt(value: Date) {
    this._props.updatedAt = value;
  }

  get allProps(): Purchases {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
