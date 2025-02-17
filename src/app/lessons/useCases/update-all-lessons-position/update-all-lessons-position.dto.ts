export interface UpdateAllLessonsPositionDTO {
  owner_id: string;
  lessons: {
    lesson_id: string;
    position: number;
  }[];
}
