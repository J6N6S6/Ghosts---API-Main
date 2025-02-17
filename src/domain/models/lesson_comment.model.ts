import { LessonComments } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class LessonComment {
  private readonly _id: string;
  private readonly _props: LessonComments;

  constructor(props: LessonComments) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get parent_id(): string {
    return this._props.parent_id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get content(): string {
    return this._props.content;
  }

  set content(value: string) {
    this._props.content = value;
  }

  get likes_count(): number {
    return this._props.likes_count;
  }

  set likes_count(value: number) {
    this._props.likes_count = value;
  }

  get dislikes_count(): number {
    return this._props.dislikes_count;
  }

  set dislikes_count(value: number) {
    this._props.dislikes_count = value;
  }

  get lesson_id(): string {
    return this._props.lesson_id;
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

  get allProps(): LessonComments {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
