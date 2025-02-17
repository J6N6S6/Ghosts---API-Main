export interface UpdatePackageCustomizationDTO {
  contact?: object;
  favicon?: Buffer;
  background_color?: object;
  color_header?: object;
  user_id: string;
  package_id: string;
}
