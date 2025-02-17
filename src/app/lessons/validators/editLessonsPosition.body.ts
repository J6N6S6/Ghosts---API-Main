import { IsNotEmpty } from 'class-validator';

export class EditLessonsPositionBody {
  @IsNotEmpty()
  lessons: {
    lesson_id: string;
    position: number;
  }[];
}
