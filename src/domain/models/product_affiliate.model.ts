import { ProductsAffiliates } from '@/infra/database/entities';

export class ProductAffiliate {
  private readonly _id: string;
  private readonly _props: ProductsAffiliates;

  constructor(props: ProductsAffiliates) {
    this._id = props.id;
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

  get status(): string {
    return this._props.status;
  }

  set status(value: string) {
    this._props.status = value;
  }

  get blocked(): boolean {
    return this._props.blocked;
  }

  set blocked(value: boolean) {
    this._props.blocked = value;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get updatedAt(): Date | null {
    return this._props.updatedAt;
  }

  set updatedAt(value: Date) {
    this._props.updatedAt = value;
  }

  get allProps(): ProductsAffiliates {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
