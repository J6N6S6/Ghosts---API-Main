export interface SaveUserLessonProgressDTO {
  lesson_completed: boolean;
  lesson_id: string;
  lesson_timestamp: number;
  user_id: string;
}
