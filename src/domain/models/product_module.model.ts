import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class ProductModule {
  private _id: string;
  private _props: ProductsModules;

  constructor(props: ProductsModules) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get show_title(): boolean {
    return this._props.show_title;
  }

  set show_title(show_title: boolean) {
    this._props.show_title = show_title;
  }

  get title(): string | null {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get image(): string | null {
    return this._props.image;
  }

  set image(image: string) {
    this._props.image = image;
  }

  get position(): number {
    return this._props.position;
  }

  set position(position: number) {
    this._props.position = position;
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

  get allProps(): ProductsModules {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
