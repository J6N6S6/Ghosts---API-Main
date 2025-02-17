export interface UploadVideoDTO {
  filepath: string;
  filename: string;
  video_url?: string;
  video: {
    name?: string;
    description?: string;
  };
  user_id: string;
  product_id: string;
  lesson_id: string;
}
