import { Injectable } from '@nestjs/common';
import { AffiliationActionControlCase } from '../useCases/affiliation-action-control/affiliation_action_control.case';
import { AffiliationActionControlDTO } from '../useCases/affiliation-action-control/affiliation_action_control.dto';
import { ListAffiliationsCase } from '../useCases/list-affiliation/list_affiliations.case';
import { ListAffiliationsDTO } from '../useCases/list-affiliation/list_affiliations.dto';
import { RequestAffiliationCase } from '../useCases/request-affiliation/request_affiliation.case';
import { RequestAffiliationDTO } from '../useCases/request-affiliation/request_affiliation.dto';

@Injectable()
export class ProductsAffiliatesService {
  constructor(
    private readonly requestAffiliationCase: RequestAffiliationCase,
    private readonly listAffiliationsCase: ListAffiliationsCase,
    private readonly affiliationActionControlCase: AffiliationActionControlCase,
  ) {}

  async requestAffiliation(data: RequestAffiliationDTO) {
    return this.requestAffiliationCase.execute(data);
  }

  async listAffiliations(data: ListAffiliationsDTO) {
    return this.listAffiliationsCase.execute(data);
  }

  async affiliationActionControl(data: AffiliationActionControlDTO) {
    return this.affiliationActionControlCase.execute(data);
  }
}
