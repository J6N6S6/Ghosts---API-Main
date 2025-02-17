export interface EditProductModuleDTO {
  module_id: string;
  show_title: boolean;
  owner_id: string;
  title: string;
  image?: Buffer;
}
