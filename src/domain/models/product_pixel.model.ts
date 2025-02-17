import { ProductsPixel } from '@/infra/database/entities/products_pixels.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';
export class ProductPixel {
  private readonly _id: string;
  private readonly _props: ProductsPixel;

  constructor(props: ProductsPixel) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get type(): 'FACEBOOK' | 'GOOGLE' | 'TIKTOK' | 'KWAI' | null {
    return this._props.type;
  }

  get token(): string {
    return this._props.token;
  }

  set token(value: string) {
    this._props.token = value;
  }

  get active(): boolean {
    return this._props.active;
  }

  set active(value: boolean) {
    this._props.active = value;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get title(): string {
    return this._props.title;
  }

  set title(value: string) {
    this._props.title = value;
  }

  get content(): string {
    return this._props.content;
  }

  set content(value: string) {
    this._props.content = value;
  }

  get domain(): string {
    return this._props.domain;
  }

  set domain(value: string) {
    this._props.domain = value;
  }

  get purchase_event_pix(): boolean {
    return this._props.purchase_event_pix;
  }

  set purchase_event_pix(value: boolean) {
    this._props.purchase_event_pix = value;
  }

  get purchase_event_bank_slip(): boolean {
    return this._props.purchase_event_bank_slip;
  }

  set purchase_event_bank_slip(value: boolean) {
    this._props.purchase_event_bank_slip = value;
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

  get allProps(): ProductsPixel {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
