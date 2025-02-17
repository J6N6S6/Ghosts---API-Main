import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateLessonCommentBody {
  @IsNotEmpty()
  @Length(1, 2000)
  content: string;

  @IsOptional()
  parent_id?: string;
}
