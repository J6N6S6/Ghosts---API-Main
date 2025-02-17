import { CreateLessonDTO } from '../create-lesson/create_lesson.dto';

export interface EditLessonDTO extends CreateLessonDTO {
  lesson_id: string;
  delete_materials?: string[];
}
