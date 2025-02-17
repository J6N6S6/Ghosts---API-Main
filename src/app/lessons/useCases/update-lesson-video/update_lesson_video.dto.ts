export interface UpdateLessonVideoDTO {
  lesson_id: string;
  product_id: string;
  user_id: string;
  video: Express.Multer.File | string | null;
  video_type?: 'FILE' | 'URL';
}
