import { LessonRatings } from '@/infra/database/entities/lesson_ratings.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class LessonRating {
  private _id: string;
  private _props: LessonRatings;

  constructor(props: LessonRatings) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get lesson_id(): string {
    return this._props.lesson_id;
  }

  get rating(): number {
    return this._props.rating;
  }

  set rating(rating: number) {
    this._props.rating = rating;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  get allProps(): LessonRatings {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
