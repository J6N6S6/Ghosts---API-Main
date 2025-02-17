export interface UpdateAllModulesPositionDTO {
  owner_id: string;
  modules: {
    module_id: string;
    position: number;
  }[];
}
