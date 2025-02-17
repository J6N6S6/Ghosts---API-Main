import { Products } from '@/infra/database/entities/products.entity';
import { Sections } from '@/infra/database/entities/sections.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Section {
  private _id: string;
  private _props: Sections;

  constructor(props: Sections) {
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

  get package_id(): string {
    return this._props.package_id;
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

  get products(): Products[] {
    return this._props.products;
  }
}
