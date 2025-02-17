import { Injectable } from '@nestjs/common';
import { CreateWarnDTO } from '../dtos/CreateWarnDTO';
import { CreateWarnCase } from '../useCases/create-warn/create-warn.case';
import { FindWarnByIdCase } from '../useCases/find-warn/find-warn-by-id.case';
import { UpdateWarnCase } from '../useCases/update-warn/update-warn.case';
import { DeleteWarnCase } from '../useCases/delete-warn/delete-warn.case';
import { FindAllWarnsCase } from '../useCases/find-all-warns/find-all-warns.case';
import { UpdateWarnDTO } from '../dtos/UpdateWarnDTO';

@Injectable()
export class WarnService {
  constructor(
    private readonly createWarnCase: CreateWarnCase,
    private readonly deleteWarnCase: DeleteWarnCase,
    private readonly findWarnByIdCase: FindWarnByIdCase,
    private readonly updateWarnCase: UpdateWarnCase,
    private readonly findAllWarnsCase: FindAllWarnsCase,
  ) {}

  async createWarn(body: CreateWarnDTO): Promise<any> {
    return this.createWarnCase.execute(body);
  }

  async deleteWarn(id: string): Promise<any> {
    return this.deleteWarnCase.execute(id);
  }

  async findWarnById(id: string): Promise<any> {
    return this.findWarnByIdCase.execute(id);
  }

  async findAllWarns(): Promise<any> {
    return this.findAllWarnsCase.execute();
  }

  async updateWarn(body: UpdateWarnDTO): Promise<any> {
    return this.updateWarnCase.execute(body);
  }
}
