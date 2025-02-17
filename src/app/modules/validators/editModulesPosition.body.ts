import { IsNotEmpty } from 'class-validator';

export class EditModulesPositionBody {
  @IsNotEmpty()
  modules: {
    module_id: string;
    position: number;
  }[];
}
