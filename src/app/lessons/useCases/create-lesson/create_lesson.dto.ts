export interface CreateLessonDTO {
  title: string;
  description?: string;
  module_id: string;
  product_id: string;
  owner_id: string;
  draft: boolean;
  comments: boolean;
  background?: Buffer;
  thumbnail?: Buffer;
  materials: {
    title: string;
    type: 'link' | 'file';
    content: string | Buffer;
    file_details?: {
      name: string;
      size: number;
      type: string;
    };
  }[];
  availability: 'immediate' | 'programmed';
  availability_type?: 'scheduled' | 'timer';
  availability_date?: Date;
  availability_days?: number;
}
