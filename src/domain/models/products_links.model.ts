import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class ProductLink {
  private readonly _id: string;
  private readonly _props: ProductsLinks;

  constructor(props: ProductsLinks) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.title;
  }

  get title(): string {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get price(): number | null {
    return this._props.price;
  }

  set price(price: number) {
    this._props.price = price;
  }

  get allow_affiliation(): boolean {
    return this._props.allow_affiliation;
  }

  set allow_affiliation(allow_affiliation: boolean) {
    this._props.allow_affiliation = allow_affiliation;
  }

  get type(): string {
    return this._props.type;
  }

  set type(type: string) {
    this._props.type = type;
  }

  get short_id(): string {
    return this._props.short_id;
  }

  get status(): string {
    return this._props.status;
  }

  set status(status: string) {
    this._props.status = status;
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

  get allProps(): ProductsLinks {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
