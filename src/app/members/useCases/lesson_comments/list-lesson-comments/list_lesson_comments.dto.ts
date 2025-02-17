export interface ListLessonCommentsDto {
  lesson_id: string;
  user_id: string;
  parent_id?: string;

  page: number;
  limit: number;
  filter?: 'most_liked' | 'older' | 'newest' | 'my_comments';
}
