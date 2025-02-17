import { Categories } from '@/infra/database/entities/categories.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Category {
  private readonly _id: string;
  private readonly _props: Categories;

  constructor(props: Categories) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get image(): string | null {
    return this._props.image;
  }

  set image(image: string) {
    this._props.image = image;
  }

  get title(): string | null {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get description(): string | null {
    return this._props.description;
  }

  set description(description: string) {
    this._props.description = description;
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
}
