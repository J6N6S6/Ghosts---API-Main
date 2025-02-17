import { IsNotEmpty } from 'class-validator';

export class SaveUserLessonProgressBody {
  @IsNotEmpty()
  lesson_completed: boolean;

  @IsNotEmpty()
  lesson_id: string;

  @IsNotEmpty()
  lesson_timestamp: number;
}
