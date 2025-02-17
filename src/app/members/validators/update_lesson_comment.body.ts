import { IsNotEmpty, Length } from 'class-validator';

export class UpdateLessonCommentBody {
  @IsNotEmpty()
  @Length(1, 2000)
  content: string;
}
