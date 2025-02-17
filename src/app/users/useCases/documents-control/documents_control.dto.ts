export interface DocumentsControlDTO {
  type: 'approved' | 'rejected' | 'pending';
  page: number;
  items_per_page: number;
  search?: string;
}
