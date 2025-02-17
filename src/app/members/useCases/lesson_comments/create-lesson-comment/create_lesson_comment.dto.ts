export interface CreateLessonCommentDto {
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
}
