export interface ProductModules {
  id: string;
  title: string;
  position: number;
  image: string;
  show_title: boolean;
  duration: number;
  progress: number;
  lessons: ProductLessons[];
}

export interface ProductLessons {
  id: string;
  title: string;
  position: number;
  description: string;
  availability: string;
  availability_date: string;
  availability_days: string;
  availability_type: string;
  thumbnail: string;
  duration: number;
  watched: boolean;
  watched_at: number;
  materials: any[] | null;
}
