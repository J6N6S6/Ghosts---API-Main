import { Packages } from '@/infra/database/entities/packages.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Package {
  private _id: string;
  private _props: Packages;

  constructor(props: Packages) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get description(): string {
    return this._props.description;
  }

  set description(description: string) {
    this._props.description = description;
  }

  get image(): string | null {
    return this._props.image;
  }

  set image(image: string) {
    this._props.image = image;
  }

  get owner_id(): string | null {
    return this._props.owner_id;
  }

  get contact(): object | null {
    return this._props.contact;
  }

  set contact(contact: object) {
    this._props.contact = contact;
  }

  get logo(): string | null {
    return this._props.logo;
  }

  set logo(logo: string) {
    this._props.logo = logo;
  }

  get banner(): string | null {
    return this._props.banner;
  }

  set banner(banner: string) {
    this._props.banner = banner;
  }

  get favicon(): string | null {
    return this._props.favicon;
  }

  set favicon(favicon: string) {
    this._props.favicon = favicon;
  }

  get color_header(): object | null {
    return this._props.color_header;
  }

  set color_header(color_header: object) {
    this._props.color_header = color_header;
  }

  get background_color(): object | null {
    return this._props.background_color;
  }

  set background_color(background_color: object) {
    this._props.background_color = background_color;
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
