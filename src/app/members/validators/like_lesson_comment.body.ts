import { IsBoolean, ValidateIf } from 'class-validator';

export class LikeLessonCommentBody {
  @IsBoolean()
  @ValidateIf((o) => o.like !== null)
  like: boolean;
}
