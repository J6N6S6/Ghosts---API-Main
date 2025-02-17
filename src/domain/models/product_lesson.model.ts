import { ProductsLessons } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class ProductLesson {
  private _id: string;
  private _props: ProductsLessons;

  constructor(props: ProductsLessons) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get module_id(): string {
    return this._props.module_id;
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

  get thumbnail(): string | null {
    return this._props.thumbnail;
  }

  set thumbnail(thumbnail: string) {
    this._props.thumbnail = thumbnail;
  }

  get video_url(): string | null {
    return this._props.video_url;
  }

  set video_url(video_url: string) {
    this._props.video_url = video_url;
  }

  get video_internal(): boolean {
    return this._props.video_internal;
  }

  set video_internal(video_internal: boolean) {
    this._props.video_internal = video_internal;
  }

  get video_status(): string | null {
    return this._props.video_status;
  }

  set video_status(video_status: string) {
    this._props.video_status = video_status;
  }

  get duration(): number {
    return this._props.duration;
  }

  set duration(duration: number) {
    this._props.duration = duration;
  }

  get background(): string | null {
    return this._props.background;
  }

  set background(background: string) {
    this._props.background = background;
  }

  get draft(): boolean {
    return this._props.draft;
  }

  set draft(draft: boolean) {
    this._props.draft = draft;
  }

  get comments(): boolean {
    return this._props.comments;
  }

  set comments(comments: boolean) {
    this._props.comments = comments;
  }

  get availability(): string {
    return this._props.availability;
  }

  set availability(availability: string) {
    this._props.availability = availability;
  }

  get availability_type(): string | null {
    return this._props.availability_type;
  }

  set availability_type(availability_type: string) {
    this._props.availability_type = availability_type;
  }

  get availability_date(): Date | null {
    return this._props.availability_date;
  }

  set availability_date(availability_date: Date) {
    this._props.availability_date = availability_date;
  }

  get availability_days(): number | null {
    return this._props.availability_days;
  }

  set availability_days(availability_days: number) {
    this._props.availability_days = availability_days;
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

  get allProps(): ProductsLessons {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
