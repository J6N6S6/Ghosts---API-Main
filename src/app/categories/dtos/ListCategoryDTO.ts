export interface ListCategoryDTO {
  id: string;
  image: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
