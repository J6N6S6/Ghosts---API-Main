import { LessonCommentsLikes } from '@/infra/database/entities';

export class LessonCommentLike {
  private readonly _props: LessonCommentsLikes;

  constructor(props: LessonCommentsLikes) {
    this._props = props;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get like(): number {
    return this._props.like;
  }

  set like(value: number) {
    this._props.like = value;
  }

  get comment_id(): string {
    return this._props.comment_id;
  }

  get allProps(): LessonCommentsLikes {
    return this._props;
  }
}
