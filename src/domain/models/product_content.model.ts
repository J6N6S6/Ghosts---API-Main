import { ProductsMaterials } from '@/infra/database/entities';
import { ProductsContentEntity } from '@/infra/database/entities/products_content.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class ProductContentModel {
  private _id: string;
  private _props: ProductsContentEntity;

  constructor(props: ProductsContentEntity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get title(): string | null {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get type(): string {
    return this._props.type;
  }

  set type(type: string) {
    this._props.type = type;
  }

  get content(): string | null {
    return this._props.content;
  }

  set content(content: string) {
    this._props.content = content;
  }

  get file_details(): {
    name: string;
    size: number;
    type: string;
  } | null {
    return this._props.file_details;
  }

  set file_details(
    file_details: {
      name: string;
      size: number;
      type: string;
    } | null,
  ) {
    this._props.file_details = file_details;
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

  get allProps(): ProductsContentEntity {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
