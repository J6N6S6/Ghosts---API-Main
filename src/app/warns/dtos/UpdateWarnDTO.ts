import { CreateWarnDTO } from './CreateWarnDTO';

export interface UpdateWarnDTO extends Partial<CreateWarnDTO> {
  id?: string;
}
