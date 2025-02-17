import { Injectable } from '@nestjs/common';
import { AcceptInviteCoProducerCase } from '../useCases/accept-invite-co-producer/accept_invite_co_producer';
import { AcceptInviteCoProducerDTO } from '../useCases/accept-invite-co-producer/accept_invite_co_producer.dto';
import { InviteCoProducerCase } from '../useCases/invite-co-producer/invite_co_producer.case';
import { IInviteCoProducerDTO } from '../useCases/invite-co-producer/invite_co_producer.dto';
import { ListProductCoProducersCase } from '../useCases/list-product-co-producers/list_product_co_producers.case';
import { RemoveCoProducerCase } from '../useCases/remove-co-producer/remove_co_producer.case';
import { RemoveCoProducerDTO } from '../useCases/remove-co-producer/remove_co_producer.dto';
import { UpdateCoProducerDTO } from '../useCases/update-co-producer/update_co_producer.dto';
import { UpdateCoProducerCase } from '../useCases/update-co-producer/update_co_producer';

@Injectable()
export class CoProducersService {
  constructor(
    private readonly inviteCoProducerCase: InviteCoProducerCase,
    private readonly acceptInviteCoProducerCase: AcceptInviteCoProducerCase,
    private readonly listProductCoProducersCase: ListProductCoProducersCase,
    private readonly removeCoProducerCase: RemoveCoProducerCase,
    private readonly updateCoProducerCase: UpdateCoProducerCase,
  ) {}

  async create(data: IInviteCoProducerDTO) {
    return this.inviteCoProducerCase.execute(data);
  }

  async update(data: UpdateCoProducerDTO) {
    return this.updateCoProducerCase.execute(data);
  }

  async acceptInvite(data: AcceptInviteCoProducerDTO) {
    return this.acceptInviteCoProducerCase.execute(data);
  }

  async listCoProducers(product_id: string, user_id: string) {
    return this.listProductCoProducersCase.execute({ product_id, user_id });
  }

  async removeCoProducer(data: RemoveCoProducerDTO) {
    await this.removeCoProducerCase.execute(data);
    return {
      hasError: false,
      message: 'Co-produtor removido com sucesso!',
    };
  }
}
